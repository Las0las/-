---
applyTo: "**/*.{html,css,js}"
---

# Frontend Development Instructions

## HTML Best Practices

- Use semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- Ensure all images have descriptive `alt` attributes
- Use `<label>` elements with form inputs and connect them with `for` attributes
- Include appropriate meta tags for SEO and responsiveness
- Use `<button>` for interactive elements, not `<div>` or `<span>`

## CSS Guidelines

- Utilize the existing CSS custom properties in `:root` for colors
- Avoid inline styles; keep CSS in the `<style>` block
- Use mobile-first responsive design with appropriate media queries
- Maintain consistent spacing and sizing using the existing units
- Group related styles together with clear comments
- Use CSS Grid and Flexbox for layouts
- Ensure sufficient color contrast for accessibility (WCAG AA minimum)

## JavaScript Standards

- Use `const` by default, `let` when necessary, avoid `var`
- Use template literals for string interpolation
- Implement proper error handling with try-catch blocks
- Use async/await for asynchronous operations
- Add event listeners properly and consider cleanup
- Validate user input before processing
- Use descriptive function names that explain what they do
- Keep functions focused on a single responsibility

## Accessibility Requirements

- Ensure keyboard navigation works for all interactive elements
- Add appropriate ARIA labels and roles where needed
- Maintain focus management for modal dialogs and dynamic content
- Test with screen readers in mind
- Ensure interactive elements are large enough for touch targets (44x44px minimum)

## Performance Considerations

- Minimize DOM manipulation; batch updates when possible
- Debounce or throttle frequently called event handlers
- Use event delegation for dynamic elements
- Optimize animations for performance (use `transform` and `opacity`)
- Lazy load resources when appropriate

## Testing Checklist

Before finalizing changes:
- [ ] Test in multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on different screen sizes (mobile, tablet, desktop)
- [ ] Verify keyboard navigation works
- [ ] Check console for errors or warnings
- [ ] Validate HTML syntax
- [ ] Ensure responsive behavior is maintained
