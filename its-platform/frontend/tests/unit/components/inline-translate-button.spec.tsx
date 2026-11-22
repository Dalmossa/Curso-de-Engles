import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { InlineTranslateButton } from '@/presentation/components/inline-translate-button';

describe('InlineTranslateButton', () => {
  it('renders nothing when translation is missing', () => {
    const { container } = render(<InlineTranslateButton textEn="Hello" translationPt={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('toggles translation inline with accessibility attributes', () => {
    const onToggle = vi.fn();
    render(<InlineTranslateButton textEn="Good morning" translationPt="Bom dia" onToggle={onToggle} />);

    const button = screen.getByTestId('inline-translate-button');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByTestId('inline-translate-panel')).toHaveAttribute('aria-hidden', 'true');

    fireEvent.click(button);
    expect(onToggle).toHaveBeenCalledWith(true);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Bom dia')).toBeInTheDocument();
  });
});
