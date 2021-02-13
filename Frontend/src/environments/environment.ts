// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  siteUrl : "http://localhost:4200/#/",
  baseApiUrl: 'http://localhost:53161/api/v1/',
  coinPaymentMerAcc : '7abf1e36724948f8dfb5686a3395cbb0',
  withdrawalFees:0.5,
  AllowFund:true,
  AllowPurchase:true,
  AllowAdPack:true,
  Banner125:'assets/img/125.gif',
  Banner468:'assets/img/468.gif',
  Banner728:'assets/img/728.gif',
  Banner250:'assets/img/250.gif',
  BannerFB:'assets/img/fb.jpg',
  CompanyPresentation:'assets/companypresentation.pdf',
  telegram : "telelink",
  facebook : "facebook",
  twitter : "twitter",
  Managers :[],
  Phases : [
    {
      Name : "Board 1",
      Cost : 39,
      Levels : [
        {LevelNo:1,Member:3,Commission:7},
        {LevelNo:2,Member:9,Commission:4},
        {LevelNo:3,Member:27,Commission:4},
        {LevelNo:4,Member:81,Commission:13},
      ],
      DirectBonus : 6.5,
      TotalEarning : 1218,
      TableColor : "pink"
    },
    {
      Name : "Board 2",
      Cost : 590,
      Levels : [
        {LevelNo:1,Member:3,Commission:88},
        {LevelNo:2,Member:9,Commission:59},
        {LevelNo:3,Member:27,Commission:59},
        {LevelNo:4,Member:81,Commission:188},
      ],
      TotalEarning : 17458,
      TableColor : "blue"
    },
    {
      Name : "Board 3",
      Cost : 8434,
      Levels : [
        {LevelNo:1,Member:3,Commission:1518},
        {LevelNo:2,Member:9,Commission:843},
        {LevelNo:3,Member:27,Commission:843},
        {LevelNo:4,Member:81,Commission:2698},
      ],
      TotalEarning : 253440.36,
      TableColor : "pink"
    },
    {
      Name : "Board 4",
      Cost : 123689,
      Levels : [
        {LevelNo:1,Member:3,Commission:13495.32},
        {LevelNo:2,Member:9,Commission:12369},
        {LevelNo:3,Member:27,Commission:12369},
        {LevelNo:4,Member:81,Commission:39580.5},
      ],
      TotalEarning : 4007529.98,
      TableColor : "blue"
    },
    {
      Name : "Board 5",
      Cost : 1941920.49,
      Levels : [
        {LevelNo:1,Member:3,Commission:349545.69},
        {LevelNo:2,Member:9,Commission:194192.05},
        {LevelNo:3,Member:27,Commission:194192.05},
        {LevelNo:4,Member:81,Commission:621414.56},
      ],
      TotalEarning : 58374229.9,
      TableColor : "pink"
    },
    {
      Name : "Board 6",
      Cost : 28216154.7,
      Levels : [
        {LevelNo:1,Member:3,Commission:349545.69},
        {LevelNo:2,Member:9,Commission:2821615.47},
        {LevelNo:3,Member:27,Commission:2821615.47},
        {LevelNo:4,Member:81,Commission:9029169.5},
      ],
      TotalEarning : 838019794,
      TableColor : "blue"
    }
  ]
};
