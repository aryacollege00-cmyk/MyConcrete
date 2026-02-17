import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

const SearchBar = ({ 
  placeholder = "Search...", 
  onRecommendation, 
  onSelect, 
  renderItem,
  style,
  ...props 
}) => {
  const [searchText, setSearchText] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (searchText.trim() && onRecommendation) {
      onRecommendation(searchText).then((results) => {
        setRecommendations(results || []);
        setShowDropdown(true);
      });
    } else {
      setRecommendations([]);
      setShowDropdown(false);
    }
  }, [searchText, onRecommendation]);

  const handleSelect = (item) => {
    setSearchText('');
    setShowDropdown(false);
    setRecommendations([]);
    if (onSelect) {
      onSelect(item);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.searchInputContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
          {...props}
        />
      </View>
      
      {showDropdown && (
  <View style={styles.dropdown}>
    {recommendations.length > 0 ? (
      <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
        {recommendations.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.dropdownItem}
            onPress={() => handleSelect(item)}
          >
            {renderItem ? renderItem(item, () => handleSelect(item)) : (
              <Text style={styles.dropdownItemText}>{item.name || item.username}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    ) : (
      <View style={styles.dropdownItem}>
        <Text style={styles.dropdownItemText}>No items found</Text>
      </View>
    )}
  </View>
)}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  dropdown: {
    position: 'relative',
    top: '0%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    maxHeight: 200,
    zIndex: 1001,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default SearchBar;