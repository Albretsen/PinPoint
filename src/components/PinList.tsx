import { useTheme } from '@/src/context/ThemeProvider';
import { useTranslation } from '@/src/i18n/useTranslation';
import { ContentStyle, FlashList } from '@shopify/flash-list';
import React, { useCallback, useRef, useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

interface SkeletonStyle {
  height?: number;
  borderRadius?: number;
  backgroundColor?: string;
  marginVertical?: number;
  marginHorizontal?: number;
}

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
}: PinListProps<T>) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const listRef = useRef<FlashList<T>>(null);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchData();
    } finally {
      setRefreshing(false);
    }
  }, [fetchData]);

  const scrollToTop = useCallback(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  const scrollToIndex = useCallback((index: number, animated = true) => {
    listRef.current?.scrollToIndex({ index, animated });
  }, []);

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
          padding: 20,
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
        ListHeaderComponent={ListHeaderComponent}
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
    padding: 20,
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
}); 