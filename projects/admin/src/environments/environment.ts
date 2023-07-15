// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,

    frontendUrl: 'http://localhost:4200/',
    backendUrl: 'http://localhost:4200/admin/',

    // For Local
    //WebAPIUrl: 'http://localhost:6010/v1/',
    //uploadsUrl: 'http://localhost:6010/uploads/',
    //uploadedUrl: 'http://localhost:6010/uploads/photos/',

    //For wifi 3
    // WebAPIUrl: 'http://192.168.1.40:6010/v1/',
    // uploadsUrl: 'http://192.168.1.40:6010/uploads/',
    // uploadedUrl: 'http://192.168.1.40:6010/uploads/photos/',

    //For wifi 4
    WebAPIUrl: 'http://122.170.0.3:6010/v1/',
    uploadsUrl: 'http://122.170.0.3:6010/uploads/',
    uploadedUrl: 'http://122.170.0.3:6010/uploads/photos/',


    // For Live
    // WebAPIUrl: 'http://122.170.111.66:6010/v1/',
    // uploadsUrl: 'http://122.170.111.66:6010/uploads/',
    // uploadedUrl: 'http://122.170.111.66:6010/uploads/photos/',

};