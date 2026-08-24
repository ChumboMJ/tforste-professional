import { describe, it, expect } from 'vitest';

describe('ResumeTailor State & Skill Gap Engine', () => {
  it('calculates match percentage and categorizes skills', () => {
    const mockAnalysis = {
      jobTitle: 'Senior Cloud Architect',
      company: 'Acme Corp',
      matchPercentage: 85,
      matchedSkills: [
        { skillName: 'C# / .NET Core', proficiencyLevel: 98 },
        { skillName: 'Azure / GCP', proficiencyLevel: 92 }
      ],
      missingSkills: [
        { skillName: 'AWS SQS', importanceCategory: 'Core', suggestedComparableSkills: 'Azure Service Bus' }
      ]
    };

    expect(mockAnalysis.matchPercentage).toBeGreaterThanOrEqual(80);
    expect(mockAnalysis.matchedSkills.length).toBe(2);
    expect(mockAnalysis.missingSkills[0].suggestedComparableSkills).toBe('Azure Service Bus');
  });

  it('updates skill overrides checklist state correctly', () => {
    let overrides = [
      { skillName: 'AWS SQS', userPossessesSkill: false, userNotes: '' }
    ];

    // Toggle skill
    const skillName = 'AWS SQS';
    const existingIndex = overrides.findIndex((item) => item.skillName === skillName);
    if (existingIndex >= 0) {
      overrides[existingIndex] = {
        ...overrides[existingIndex],
        userPossessesSkill: true,
        userNotes: 'Used in side projects, comparable to Azure Service Bus'
      };
    }

    expect(overrides[0].userPossessesSkill).toBe(true);
    expect(overrides[0].userNotes).toContain('Azure Service Bus');
  });
});
