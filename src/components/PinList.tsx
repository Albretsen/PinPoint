import { useTheme } from '@/src/context/ThemeProvider';
import { useTranslation } from '@/src/i18n/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import { ContentStyle, FlashList } from '@shopify/flash-list';
import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';

interface SkeletonStyle {
  height?: number;
  borderRadius?: number;
  backgroundColor?: string;
  marginVertical?: number;
  marginHorizontal?: number;
}

export type SortOption = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

interface PinListProps<T> {
  data: T[];
  renderItem: (item: T) => React.ReactElement;
  fetchData: () => Promise<T[]>;
  isLoading: boolean;
  error: Error | null;
  emptyMessage?: string;
  style?: ViewStyle;
  contentContainerStyle?: ContentStyle;
  onEndReached?: () => void;
  hasMore?: boolean;
  keyExtractor?: (item: T) => string;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  estimatedItemSize?: number;
  skeletonStyle?: SkeletonStyle;
  onRetry?: () => void;
  enableSearch?: boolean;
  enableSorting?: boolean;
  sortOptions?: SortOption[];
  onSearch?: (query: string) => void;
  onSort?: (sortOption: SortOption) => void;
  searchPlaceholder?: string;
}

const SkeletonLoader = ({ style }: { style?: SkeletonStyle }) => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        {
          height: style?.height || 300,
          borderRadius: style?.borderRadius || 8,
          backgroundColor: style?.backgroundColor || theme.colors.skeleton,
          marginVertical: style?.marginVertical || 8,
          marginHorizontal: style?.marginHorizontal || 0,
        },
      ]}
    />
  );
};

const SearchAndSortHeader = ({
  enableSearch,
  enableSorting,
  sortOptions,
  onSearch,
  onSort,
  searchPlaceholder,
  selectedSortOption,
}: {
  enableSearch?: boolean;
  enableSorting?: boolean;
  sortOptions?: SortOption[];
  onSearch?: (query: string) => void;
  onSort?: (sortOption: SortOption) => void;
  searchPlaceholder?: string;
  selectedSortOption?: SortOption;
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSortModal, setShowSortModal] = useState(false);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    onSearch?.(text);
  };

  const handleSortSelect = (option: SortOption) => {
    onSort?.(option);
    setShowSortModal(false);
  };

  return (
    <View style={styles.searchSortContainer}>
      {enableSearch && (
        <View style={[styles.searchContainer, { backgroundColor: theme.colors.card }]}>
          <Ionicons name="search" size={20} color={theme.colors.text} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder={searchPlaceholder}
            placeholderTextColor={theme.colors.secondary}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      )}
      {enableSorting && sortOptions && (
        <>
          <TouchableOpacity
            style={[styles.sortButton, { backgroundColor: theme.colors.card }]}
            onPress={() => setShowSortModal(true)}
          >
            <Ionicons name={selectedSortOption?.icon || 'funnel-outline'} size={20} color={theme.colors.text} />
            <Text style={[styles.sortButtonText, { color: theme.colors.text }]}>
              {selectedSortOption?.label || t('list.sort')}
            </Text>
          </TouchableOpacity>

          <Modal
            visible={showSortModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowSortModal(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowSortModal(false)}
            >
              <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
                {sortOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.sortOption,
                      selectedSortOption?.id === option.id && { backgroundColor: theme.colors.primary + '20' }
                    ]}
                    onPress={() => handleSortSelect(option)}
                  >
                    <Ionicons name={option.icon} size={20} color={theme.colors.text} />
                    <Text style={[styles.sortOptionText, { color: theme.colors.text }]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>
        </>
      )}
    </View>
  );
};

export default function PinList<T>({
  data,
  renderItem,
  fetchData,
  isLoading,
  error,
  emptyMessage,
  style,
  contentContainerStyle,
  onEndReached,
  hasMore = false,
  keyExtractor,
  ListHeaderComponent,
  estimatedItemSize = 100,
  skeletonStyle,
  onRetry,
  enableSearch,
  enableSorting,
  sortOptions,
  onSearch,
  onSort,
  searchPlaceholder,
}: PinListProps<T>) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState<SortOption | undefined>(
    sortOptions?.[0]
  );
  const listRef = useRef<FlashList<T>>(null);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchData();
    } finally {
      setRefreshing(false);
    }
  }, [fetchData]);

  const handleSort = useCallback((option: SortOption) => {
    setSelectedSortOption(option);
    onSort?.(option);
  }, [onSort]);

  if (isLoading && !refreshing) {
    return (
      <View style={[styles.container, style]}>
        <FlashList
          data={Array(5).fill(null)}
          renderItem={() => <SkeletonLoader style={skeletonStyle} />}
          estimatedItemSize={estimatedItemSize}
          contentContainerStyle={{
            padding: 20,
            ...contentContainerStyle,
          }}
          ListHeaderComponent={ListHeaderComponent}
        />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorTitle, { color: theme.colors.error }]}>
            {t('list.error.title')}
          </Text>
          <Text style={[styles.errorMessage, { color: theme.colors.text }]}>
            {error.message}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
            onPress={onRetry || onRefresh}
          >
            <Text style={[styles.retryButtonText, { color: theme.colors.background }]}>
              {t('list.error.retry')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <FlashList
        ref={listRef}
        data={data}
        renderItem={({ item }: { item: T }) => renderItem(item)}
        keyExtractor={keyExtractor}
        contentContainerStyle={{
          ...contentContainerStyle,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            {emptyMessage || t('list.error.empty')}
          </Text>
        }
        ListHeaderComponent={
          <View>
            {(enableSearch || enableSorting) && (
              <SearchAndSortHeader
                enableSearch={enableSearch}
                enableSorting={enableSorting}
                sortOptions={sortOptions}
                onSearch={onSearch}
                onSort={handleSort}
                searchPlaceholder={searchPlaceholder}
                selectedSortOption={selectedSortOption}
              />
            )}
            {typeof ListHeaderComponent === 'function'
              ? <ListHeaderComponent />
              : ListHeaderComponent}
          </View>
        }
        estimatedItemSize={estimatedItemSize}
        ListFooterComponent={
          hasMore ? (
            <ActivityIndicator
              size="small"
              color={theme.colors.primary}
              style={styles.footerLoader}
            />
          ) : null
        }
        removeClippedSubviews={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorMessage: {
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.7,
  },
  footerLoader: {
    marginVertical: 20,
  },
  searchSortContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 8,
    height: 40,
    gap: 4,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 12,
    padding: 16,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  sortOptionText: {
    fontSize: 16,
  },
}); 