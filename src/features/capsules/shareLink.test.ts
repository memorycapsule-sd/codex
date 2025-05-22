import { generateCapsuleShareLink } from './shareLink';

it('generates share link with capsule id', () => {
  const link = generateCapsuleShareLink('abc123');
  expect(link).toContain('/c/abc123');
});
