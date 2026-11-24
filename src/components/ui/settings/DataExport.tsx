'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport, faDownload } from '@fortawesome/free-solid-svg-icons';
import { getAllChallenges } from '@/lib/db';

export const DataExport = () => {
  const [isExportingJson, setIsExportingJson] = useState(false);
  const [isExportingMd, setIsExportingMd] = useState(false);

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportJson = async () => {
    setIsExportingJson(true);
    try {
      const challenges = await getAllChallenges();
      const exportData = {
        app: 'Grit',
        version: '2.0',
        exportDate: new Date().toISOString(),
        challenges,
      };
      const jsonStr = JSON.stringify(exportData, null, 2);
      const dateStr = new Date().toISOString().split('T')[0];
      downloadFile(jsonStr, `grit-challenge-history-${dateStr}.json`, 'application/json');
    } catch (error) {
      console.error('Failed to export JSON:', error);
      alert('Failed to export challenge history.');
    } finally {
      setIsExportingJson(false);
    }
  };

  const handleExportMarkdown = async () => {
    setIsExportingMd(true);
    try {
      const challenges = await getAllChallenges();
      let md = `# Grit Challenge History Export\n`;
      md += `*Exported on: ${new Date().toLocaleString()}*\n\n`;
      md += `---\n\n`;

      if (challenges.length === 0) {
        md += `*No challenges found in local storage.*\n`;
      }

      for (const challenge of challenges) {
        md += `## Challenge: ${challenge.name}\n`;
        md += `- **Type:** ${challenge.type.toUpperCase()}\n`;
        md += `- **Status:** ${challenge.status.toUpperCase()}\n`;
        md += `- **Start Date:** ${challenge.startDate}\n`;
        md += `- **Duration:** ${challenge.duration} Days\n`;
        if (challenge.completionDate) {
          md += `- **Completion Date:** ${challenge.completionDate}\n`;
        }
        md += `\n### Rules\n`;
        md += `- Workouts: ${challenge.rules.workouts} (${challenge.rules.workoutDuration} mins)\n`;
        md += `- Water: ${challenge.rules.water} oz\n`;
        md += `- Reading: ${challenge.rules.reading} pages (${challenge.rules.readingType})\n`;
        md += `- Diet Rule: ${challenge.rules.dietRule}\n`;
        md += `- Alcohol Rule: ${challenge.rules.alcoholRule}\n`;
        md += `- Photo Rule: ${challenge.rules.photoRule}\n\n`;

        md += `### Daily Logs & Journals\n\n`;
        const sortedDays = Object.keys(challenge.days)
          .map(Number)
          .sort((a, b) => a - b);

        for (const day of sortedDays) {
          const dayData = challenge.days[day];
          if (!dayData) continue;

          const statusIcon = dayData.completed ? '✅' : '⏳';
          md += `#### Day ${day} ${statusIcon}\n`;
          md += `- **Completed:** ${dayData.completed ? 'Yes' : 'No'}\n`;
          if (dayData.weight) md += `- **Weight:** ${dayData.weight} lbs\n`;
          if (dayData.waterConsumed) md += `- **Water Consumed:** ${dayData.waterConsumed} oz\n`;
          
          md += `- **Tasks:**\n`;
          md += `  - Diet: ${dayData.tasks.diet ? '✓' : '✗'}\n`;
          md += `  - Workout 1: ${dayData.tasks.workout1 ? '✓' : '✗'}\n`;
          md += `  - Workout 2: ${dayData.tasks.workout2 ? '✓' : '✗'}\n`;
          if (dayData.tasks.workout3) md += `  - Workout 3: ✓\n`;
          md += `  - Water: ${dayData.tasks.water ? '✓' : '✗'}\n`;
          md += `  - Reading: ${dayData.tasks.reading ? '✓' : '✗'}\n`;
          md += `  - Progress Photo: ${dayData.tasks.progressPhoto ? '✓' : '✗'}\n`;

          if (dayData.journal && dayData.journal.trim().length > 0) {
            md += `\n**Journal Entry:**\n> ${dayData.journal.replace(/\n/g, '\n> ')}\n`;
          }
          md += `\n`;
        }
        md += `\n---\n\n`;
      }

      const dateStr = new Date().toISOString().split('T')[0];
      downloadFile(md, `grit-challenge-history-${dateStr}.md`, 'text/markdown');
    } catch (error) {
      console.error('Failed to export Markdown:', error);
      alert('Failed to export markdown history.');
    } finally {
      setIsExportingMd(false);
    }
  };

  return (
    <div className="bg-[var(--color-surface)] p-4 rounded-lg border border-[var(--color-surface-border)] mt-4">
      <h4 className="text-lg font-bold font-orbitron mb-2 flex items-center gap-2">
        <FontAwesomeIcon icon={faFileExport} className="text-[var(--color-primary)]" />
        Data Backup & Export
      </h4>
      <p className="text-xs text-[var(--color-text-muted)] mb-4">
        Export your complete challenge history and journals locally. Works entirely offline.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleExportJson}
          disabled={isExportingJson}
          className="flex-1 bg-[var(--color-secondary)] hover:bg-gray-700 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 text-sm">
          <FontAwesomeIcon icon={faDownload} />
          {isExportingJson ? 'Exporting JSON...' : 'Download JSON Backup'}
        </button>
        <button
          onClick={handleExportMarkdown}
          disabled={isExportingMd}
          className="flex-1 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 text-sm">
          <FontAwesomeIcon icon={faDownload} />
          {isExportingMd ? 'Exporting Markdown...' : 'Download Markdown (.md)'}
        </button>
      </div>
    </div>
  );
};

export default DataExport;
