// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


const serverUrl='https://be-app-san-wkb-nb-dev-e2hmfzh8hvbgd7g4.southafricanorth-01.azurewebsites.net/api/v1';


// The list of file replacements can be found in `angular.json`.
export const environment = {
  env_name: 'prod',
  production: true,
  apiUrl: serverUrl,
  apiEndpoints: {
    userProfile:'user-profiles'
  },
  adConfig: {
    clientId: '057a3487-9f78-4a2c-9115-813cf8a366df',
    readScopeUrl: 'api://057a3487-9f78-4a2c-9115-813cf8a366df/scope_workbench',
    writeScopeUrl: '',
    // redirectUri: 'http://localhost:4200/home',
    redirectUri: 'https://fe-app-san-wkb-nb-dev-dtb7hhgxhta2crey.southafricanorth-01.azurewebsites.net/home',
    scopeUrls: [
      'api://057a3487-9f78-4a2c-9115-813cf8a366df/scope_workbench'
    ],
    apiEndpointUrl: '',
    tenantId: "88967783-f7e1-448e-bbcf-8b5e2776c0d8",
    getTokenUrl: "https://be-app-san-wkb-nb-dev-e2hmfzh8hvbgd7g4.southafricanorth-01.azurewebsites.net/api/v1/auth/get_token"
  },
  cacheTimeInMinutes: 30,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
/** import 'zone.js/plugins/zone-error';  // Included with Angular CLI.*/