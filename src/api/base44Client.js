// import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a mock client for local development
export const base44 = {
  entities: {
    Contact: {},
    Photo: {},
    Review: {},
    ReviewLike: {},
    ReviewReport: {},
  },
  auth: {},
  integrations: {
    Core: {
      InvokeLLM: {},
      SendEmail: {},
      UploadFile: {},
      GenerateImage: {},
      ExtractDataFromUploadedFile: {},
    }
  }
};

// Uncomment for production use:
// export const base44 = createClient({
//   appId: "68ad8266d3f7a3e6710e5720", 
//   requiresAuth: true
// });
