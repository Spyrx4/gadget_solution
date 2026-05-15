'use client';

interface CategoryPillProps {
  category: string;
  isActive: boolean;
  onClick: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  'All': 'var(--color-surface-strong)',
  'Gaming Smartphone': 'var(--color-timeline-thinking)',
  'Gaming Laptop': 'var(--color-timeline-grep)',
  'Gaming Monitor': 'var(--color-timeline-read)',
  'Gaming Mouse': 'var(--color-timeline-edit)',
  'Gaming Keyboard': 'var(--color-timeline-done)',
  'Gaming Headset': 'var(--color-timeline-thinking)',
  'Graphics Card': 'var(--color-timeline-grep)',
  'Processor': 'var(--color-timeline-read)',
  'Memory': 'var(--color-timeline-edit)',
  'Storage': 'var(--color-timeline-done)',
};

const CATEGORY_LABELS: Record<string, string> = {
  'All': 'Semua',
  'Gaming Smartphone': 'Smartphone',
  'Gaming Laptop': 'Laptop',
  'Gaming Monitor': 'Monitor',
  'Gaming Mouse': 'Mouse',
  'Gaming Keyboard': 'Keyboard',
  'Gaming Headset': 'Headset',
  'Graphics Card': 'GPU',
  'Processor': 'Prosesor',
  'Memory': 'RAM',
  'Storage': 'Storage',
};

export default function CategoryPill({ category, isActive, onClick }: CategoryPillProps) {
  const bgColor = CATEGORY_COLORS[category] || 'var(--color-surface-strong)';
  const label = CATEGORY_LABELS[category] || category;

  return (
    <button
      onClick={onClick}
      className="shrink-0 transition-all duration-200 active:scale-95"
      style={{
        padding: '6px 16px',
        borderRadius: '9999px',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.88px',
        textTransform: 'uppercase' as const,
        backgroundColor: isActive ? bgColor : 'transparent',
        color: isActive ? 'var(--color-ink)' : 'var(--color-muted)',
        border: isActive ? 'none' : '1px solid var(--color-hairline)',
      }}
    >
      {label}
    </button>
  );
}
