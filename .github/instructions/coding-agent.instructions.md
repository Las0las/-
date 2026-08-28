---
excludeAgent: code-review
---

# Coding Agent Instructions

## Task Execution

- Carefully read and understand the full issue description before starting
- Break down complex tasks into smaller, manageable steps
- Test changes thoroughly before completing the task
- Provide clear explanations of what was changed and why

## Code Changes

- Make minimal, focused changes that address the specific issue
- Preserve existing functionality unless explicitly asked to change it
- Maintain the existing code style and conventions
- Add comments only when necessary to explain complex logic
- Test all changes by opening the HTML file in a browser

## Communication

- Ask clarifying questions if requirements are unclear or ambiguous
- Document significant changes in commit messages
- Highlight any assumptions made during implementation
- Report any discovered bugs or issues, even if not part of the original task

## Quality Standards

- Ensure all code is properly formatted and indented
- Validate that HTML is syntactically correct
- Check that CSS changes don't break existing layouts
- Verify JavaScript changes don't introduce console errors
- Test responsive behavior across different screen sizes

## Common Tasks

### Bug Fixes
- Reproduce the bug first
- Identify the root cause
- Implement a minimal fix
- Verify the bug is resolved
- Check for related issues

### Feature Additions
- Understand the feature requirements completely
- Plan the implementation approach
- Implement following existing patterns
- Test the new feature thoroughly
- Update documentation if needed

### UI/UX Improvements
- Maintain visual consistency with existing design
- Ensure changes work across all screen sizes
- Test accessibility of new elements
- Verify color contrast and readability

## What NOT to Do

- Don't add external libraries or dependencies without approval
- Don't make unrelated changes or "improvements" outside the scope
- Don't remove existing functionality without explicit instruction
- Don't modify files outside of what's needed for the task
- Don't introduce breaking changes
