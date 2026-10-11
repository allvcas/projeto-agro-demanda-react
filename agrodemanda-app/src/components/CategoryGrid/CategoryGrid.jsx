import React, { useRef } from 'react';
import styles from './CategoryGrid.module.css';
import CategoryTile from '../CategoryTile/CategoryTile';
import { categories } from '../../data/categories';

export default function CategoryGrid({ selectedCategory, onSelectCategory, error }) {
  const gridRef = useRef(null);

  const handleKeyDown = (e, index) => {
    let nextIndex = index;
    const numCols = 3;
    const total = categories.length;

    switch (e.key) {
      case 'ArrowRight':
        nextIndex = (index + 1) % total;
        break;
      case 'ArrowLeft':
        nextIndex = (index - 1 + total) % total;
        break;
      case 'ArrowDown':
        nextIndex = (index + numCols) % total;
        break;
      case 'ArrowUp':
        nextIndex = (index - numCols + total) % total;
        break;
      case ' ':
      case 'Enter':
        e.preventDefault();
        onSelectCategory(categories[index].id);
        return;
      default:
        return;
    }

    e.preventDefault();
    onSelectCategory(categories[nextIndex].id);
    const tiles = gridRef.current?.querySelectorAll('[role="radio"]');
    if (tiles && tiles[nextIndex]) {
      tiles[nextIndex].focus();
    }
  };

  return (
    <div className={styles.container}>
      <div
        ref={gridRef}
        role="radiogroup"
        aria-label="Categoria da necessidade"
        className={`${styles.grid} ${error ? styles.gridError : ''}`}
      >
        {categories.map((cat, idx) => {
          const isSelected = selectedCategory === cat.id;
          const isFocusable = isSelected || (!selectedCategory && idx === 0);
          return (
            <CategoryTile
              key={cat.id}
              id={cat.id}
              label={cat.label}
              icon={cat.icon}
              isSelected={isSelected}
              onSelect={onSelectCategory}
              tabIndex={isFocusable ? 0 : -1}
              onKeyDown={(e) => handleKeyDown(e, idx)}
            />
          );
        })}
      </div>
      {error && (
        <span className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
