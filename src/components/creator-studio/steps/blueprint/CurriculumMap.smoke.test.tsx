import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CreatorProvider } from '../../CreatorContext';
import { BlueprintEngine } from '../BlueprintEngine';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const generatedBlueprint = {
  curriculum_title: 'Pixel Pioneers',
  units: [
    {
      unit_number: 1,
      unit_title: 'Start the Quest',
      theme: 'Friendly introductions',
      lessons: [
        { lesson_id: 'lesson-1', lesson_number: 1, title: 'Say Hello', skill_focus: 'Speaking', objective: 'Greet a classmate.' },
        { lesson_id: 'lesson-2', lesson_number: 2, title: 'Ask Names', skill_focus: 'Vocabulary', objective: 'Ask and answer names.' },
      ],
    },
    {
      unit_number: 2,
      unit_title: 'Build the Team',
      theme: 'Teamwork language',
      lessons: [
        { lesson_id: 'lesson-3', lesson_number: 1, title: 'Team Roles', skill_focus: 'Reading/Listening', objective: 'Understand simple roles.' },
        { lesson_id: 'lesson-4', lesson_number: 2, title: 'Review Mission', skill_focus: 'Review', objective: 'Review the unit language.' },
      ],
    },
  ],
};

describe('Curriculum blueprint bulk save smoke test', () => {
  beforeEach(() => {
    const insertedLessons: any[] = [];
    let unitCount = 0;

    (supabase as any).functions = {
      invoke: vi.fn().mockResolvedValue({ data: generatedBlueprint, error: null }),
    };
    (supabase.auth.getUser as any).mockResolvedValue({ data: { user: { id: 'creator-1' } } });
    (supabase.from as any).mockImplementation((table: string) => {
      if (table === 'curriculum_levels') {
        return {
          select: vi.fn(() => ({
            order: vi.fn(() => ({
              limit: vi.fn(() => ({
                maybeSingle: vi.fn().mockResolvedValue({ data: { level_order: 17 }, error: null }),
              })),
            })),
          })),
          insert: vi.fn((payload) => ({
            select: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({ data: { id: `level-${payload.level_order}` }, error: null }),
            })),
          })),
        };
      }

      if (table === 'curriculum_units') {
        return {
          insert: vi.fn(() => {
            unitCount += 1;
            return {
              select: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({ data: { id: `unit-${unitCount}` }, error: null }),
              })),
            };
          }),
        };
      }

      if (table === 'curriculum_lessons') {
        return {
          insert: vi.fn((rows) => {
            insertedLessons.push(...rows);
            return {
              select: vi.fn().mockResolvedValue({
                data: rows.map((row: any, index: number) => ({
                  id: `draft-${index + 1}`,
                  unit_id: row.unit_id,
                  sequence_order: row.sequence_order,
                })),
                error: null,
              }),
            };
          }),
          __insertedLessons: insertedLessons,
        };
      }

      return {};
    });
  });

  it('generates a blueprint, shows the green Save Entire Blueprint button, and inserts draft lessons', async () => {
    render(
      <MemoryRouter initialEntries={['/content-creator']}>
        <CreatorProvider>
          <BlueprintEngine />
        </CreatorProvider>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: /generate master blueprint/i }));

    const saveButton = await screen.findByTestId('save-entire-blueprint-button');
    expect(saveButton).toHaveTextContent('Save Entire Blueprint to Library');
    expect(saveButton).toHaveClass('bg-emerald-600');

    fireEvent.click(saveButton);

    await waitFor(() => {
      const lessonInsertCall = (supabase.from as any).mock.results
        .map((result: any) => result.value)
        .find((builder: any) => builder.__insertedLessons?.length === 4);

      expect(lessonInsertCall.__insertedLessons).toHaveLength(4);
      expect(lessonInsertCall.__insertedLessons).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: 'Say Hello',
            is_published: false,
            created_by: 'creator-1',
            content: { slides: [] },
            ai_metadata: expect.objectContaining({ source: 'blueprint-auto-save' }),
          }),
        ]),
      );
    });
  });
});