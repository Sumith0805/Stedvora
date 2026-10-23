import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/ui/primary-button';
import { SearchField } from '@/components/ui/search-field';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { fetchExercises } from '@/features/exercises/api';
import { filterExercises, type MuscleFilter } from '@/features/exercises/filter';
import {
    equipmentLabel,
    MUSCLE_GROUP_LABELS,
    MUSCLE_GROUPS,
    type Exercise,
} from '@/features/exercises/types';
import { useTheme } from '@/hooks/use-theme';

type LoadState = 'loading' | 'ready' | 'error';

const FILTERS: { value: MuscleFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  ...MUSCLE_GROUPS.map((group) => ({ value: group, label: MUSCLE_GROUP_LABELS[group] })),
];

export default function ExercisesScreen() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();

  const [items, setItems] = useState<Exercise[]>([]);
  const [state, setState] = useState<LoadState>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<MuscleFilter>('all');

  const load = useCallback(async (isRefresh: boolean) => {
    if (isRefresh) setRefreshing(true);
    else setState('loading');

    const result = await fetchExercises();

    if (result.error) {
      setErrorMessage(result.error);
      setState('error');
    } else {
      setItems(result.data);
      setErrorMessage(null);
      setState('ready');
    }
    setRefreshing(false);
  }, []);

  useEffect(() => {
    load(false);
  }, [load]);

  const visible = useMemo(() => filterExercises(items, query, group), [items, query, group]);
  const hasFilters = query.trim() !== '' || group !== 'all';

  const clearFilters = () => {
    setQuery('');
    setGroup('all');
  };

  const header = (
    <View style={styles.header}>
      <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
        Exercises
      </Text>
      <SearchField
        value={query}
        onChangeText={setQuery}
        placeholder="Search by name or equipment"
        accessibilityLabel="Search exercises"
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {FILTERS.map((filter) => {
          const selected = group === filter.value;
          return (
            <Pressable
              key={filter.value}
              accessibilityRole="button"
              accessibilityLabel={`${filter.label} exercises`}
              accessibilityState={{ selected }}
              onPress={() => setGroup(filter.value)}
              style={[
                styles.chip,
                selected
                  ? { backgroundColor: colors.accent, borderColor: colors.accent }
                  : { backgroundColor: colors.backgroundElement, borderColor: colors.border },
              ]}>
              <Text
                style={{
                  fontWeight: '600',
                  color: selected ? colors.onAccent : colors.textSecondary,
                }}>
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      {state === 'ready' ? (
        <Text accessibilityLiveRegion="polite" style={[styles.count, { color: colors.textSecondary }]}>
          {visible.length} of {items.length} exercises
        </Text>
      ) : null}
    </View>
  );

  const empty = (() => {
    if (state === 'loading') {
      return (
        <View style={styles.centerBlock}>
          <ActivityIndicator color={colors.accent} />
          <Text style={[styles.body, { color: colors.textSecondary }]}>Loading exercises…</Text>
        </View>
      );
    }
    if (state === 'error') {
      return (
        <View style={styles.centerBlock}>
          <Text style={[styles.body, { color: colors.danger }]}>{errorMessage}</Text>
          <PrimaryButton variant="secondary" label="Try again" onPress={() => load(false)} />
        </View>
      );
    }
    if (items.length === 0) {
      return (
        <View style={styles.centerBlock}>
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            No exercises yet. Custom exercises you create will appear here.
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.centerBlock}>
        <Text style={[styles.body, { color: colors.textSecondary }]}>
          No exercises match your search.
        </Text>
        {hasFilters ? (
          <PrimaryButton variant="secondary" label="Clear filters" onPress={clearFilters} />
        ) : null}
      </View>
    );
  })();

  return (
    <FlatList
      style={{ backgroundColor: colors.background }}
      data={state === 'ready' ? visible : []}
      keyExtractor={(item) => item.id}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      refreshing={refreshing}
      onRefresh={() => load(true)}
      ListHeaderComponent={header}
      ListEmptyComponent={empty}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + Spacing.five, paddingBottom: BottomTabInset + Spacing.four },
      ]}
      ItemSeparatorComponent={() => <View style={{ height: Spacing.two }} />}
      renderItem={({ item }) => (
        <View
          accessible
          accessibilityLabel={`${item.name}, ${MUSCLE_GROUP_LABELS[item.muscle_group]}, ${equipmentLabel(
            item.equipment
          )}${item.user_id ? ', custom exercise' : ''}`}
          style={[styles.row, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
          <View style={styles.rowText}>
            <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.meta, { color: colors.textSecondary }]}>
              {MUSCLE_GROUP_LABELS[item.muscle_group]} · {equipmentLabel(item.equipment)}
            </Text>
          </View>
          {item.user_id ? (
            <Text style={[styles.badge, { color: colors.accent, borderColor: colors.accent }]}>Custom</Text>
          ) : null}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: Spacing.four },
  header: { gap: Spacing.three, marginBottom: Spacing.three },
  title: { fontSize: 32, lineHeight: 38, fontWeight: '700' },
  chips: { gap: Spacing.two, paddingRight: Spacing.four },
  chip: {
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: { fontSize: 13 },
  body: { fontSize: 15, lineHeight: 22, textAlign: 'center' },
  centerBlock: { alignItems: 'center', gap: Spacing.three, paddingVertical: Spacing.five },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  rowText: { flex: 1, gap: 2 },
  name: { fontSize: 17, fontWeight: '600' },
  meta: { fontSize: 14 },
  badge: {
    fontSize: 12,
    fontWeight: '700',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});