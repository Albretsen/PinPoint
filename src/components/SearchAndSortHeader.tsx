import { useTheme } from '@/src/context/ThemeProvider';
import { useTranslation } from '@/src/i18n/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export type SortOption = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

interface SearchAndSortHeaderProps {
  enableSearch?: boolean;
  enableSorting?: boolean;
  sortOptions?: SortOption[];
  onSearch?: (query: string) => void;
  onSort?: (sortOption: SortOption) => void;
  searchPlaceholder?: string;
  selectedSortOption?: SortOption;
  searchQuery: string;
}

export default function SearchAndSortHeader({
  enableSearch,
  enableSorting,
  sortOptions,
  onSearch,
  onSort,
  searchPlaceholder,
  selectedSortOption,
  searchQuery,
}: SearchAndSortHeaderProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [showSortModal, setShowSortModal] = useState(false);

  const handleSearch = (text: string) => {
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
            autoCapitalize="none"
            autoCorrect={false}
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
}

const styles = StyleSheet.create({
  searchSortContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
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