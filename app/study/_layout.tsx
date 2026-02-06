import { Stack } from 'expo-router';

export default function StudyLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[deckId]" />
      <Stack.Screen name="summary" />
    </Stack>
  );
}
