import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { RightRail } from '@/app/dev/proto/ai-coach/_components/RightRail';

const PANELS = {
  aiCoachPanel: <div>AI coach panel content</div>,
  commentsStub: <div>Comments stub here</div>,
  activityStub: <div>Activity stub here</div>,
};

describe('RightRail', () => {
  it('renders 3 tab buttons in DOM order: Comments, AI coach, Activity', () => {
    render(<RightRail {...PANELS} />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBe(3);
    expect(tabs[0].textContent).toMatch(/Comments/);
    expect(tabs[1].textContent).toMatch(/AI coach/);
    expect(tabs[2].textContent).toMatch(/Activity/);
  });

  it('AI coach tab is default-active on mount (aria-selected=true)', () => {
    render(<RightRail {...PANELS} />);
    const aiTab = screen.getByRole('tab', { name: /AI coach/ });
    expect(aiTab.getAttribute('aria-selected')).toBe('true');
  });

  it('Comments and Activity tabs are inactive on mount', () => {
    render(<RightRail {...PANELS} />);
    expect(screen.getByRole('tab', { name: /Comments/ }).getAttribute('aria-selected')).toBe('false');
    expect(screen.getByRole('tab', { name: /Activity/ }).getAttribute('aria-selected')).toBe('false');
  });

  it('AI coach panel content is visible on mount; other panels are hidden', () => {
    render(<RightRail {...PANELS} />);
    expect(screen.getByText('AI coach panel content')).toBeTruthy();
    expect(screen.queryByText('Comments stub here')).toBeNull();
    expect(screen.queryByText('Activity stub here')).toBeNull();
  });

  it('clicking Comments tab switches aria-selected and renders the Comments stub', () => {
    render(<RightRail {...PANELS} />);
    fireEvent.click(screen.getByRole('tab', { name: /Comments/ }));
    expect(screen.getByRole('tab', { name: /Comments/ }).getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('tab', { name: /AI coach/ }).getAttribute('aria-selected')).toBe('false');
    expect(screen.getByText('Comments stub here')).toBeTruthy();
    expect(screen.queryByText('AI coach panel content')).toBeNull();
  });

  it('clicking Activity tab switches aria-selected and renders the Activity stub', () => {
    render(<RightRail {...PANELS} />);
    fireEvent.click(screen.getByRole('tab', { name: /Activity/ }));
    expect(screen.getByRole('tab', { name: /Activity/ }).getAttribute('aria-selected')).toBe('true');
    expect(screen.getByText('Activity stub here')).toBeTruthy();
  });

  it('Comments stub renders default copy when no commentsStub prop is passed', () => {
    render(<RightRail aiCoachPanel={PANELS.aiCoachPanel} />);
    fireEvent.click(screen.getByRole('tab', { name: /Comments/ }));
    // default stub copy lives in the component
    expect(screen.getByText(/Comments \(placeholder\)/i)).toBeTruthy();
  });
});
