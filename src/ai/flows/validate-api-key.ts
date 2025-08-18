'use server';

// Validates if a Google AI API key is working
export async function validateApiKey(apiKey: string): Promise<boolean> {
  if (!apiKey || apiKey.trim() === '') {
    return false;
  }

  try {
    // Test the key by listing available models
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey.trim())}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Key is valid if request succeeds
    if (response.ok) {
      return true;
    }

    // Key is invalid if we get auth errors
    if (response.status === 403 || response.status === 401) {
      return false;
    }

    return false;
  } catch (error) {
    return false;
  }
}
