/** @format */

export const APIURL = {
    LOGIN: "/lender/login",
    WELCOME_LOGIN: "/firstLogin",
    CREATE_PASSWORD: "/resetPassword",
    CHANGE_PASSWORD: "/changePassword",
    walletCreate: "/updateAddress",
    CREATE_2FA: "/twoFactorAuthentication",
    VERIFY2FA: "/verifytwoFactorAuthentication",
    VERIFY2FATWICE: "/logintwoFactorAuthentication",
    FORGOT2FA: "/forgot2FA",
    DISABLE2FA: "/disable2Fa",
    BORROWERS: "/lender/loans",
    INGESTED: "/lender/getIngestedLoans",
    TOTAL_FIGURE: "/lender/total_figure",
    TOTAL_FIGURE_BORROWER: "/lender/total_figure/lender",
    FORGOT_PASSWORD: "/sendResetPasswordLink",
    TX_HISTORY: "/lender/dapp_history",
    GRAPH_DATA: "/lender/loanChartData",
    USER_PROFILE: "user_profile",
    INVESTOR_LOANS: "/investor/loans",
    FORGOT2FA_CLEAR: "/forgot2fa/clear",
    APPROVELONELIST: "/lender/approveLoanList",
    APPROVELLOANS: "/lender/approveLoans",
    GETPOOLDETAILS: "/pool/getPoolDetails",
    GETPOOLBATCHSTATUS: "/getBatchStatus",
    GETPOOLSUMMARY: "/pool/getPoolSummary",
    SETPOOLBATCHAPPROVAL: "/setBatchApproval",
    GETOFFERDETAILS: "/getOfferDetails",
    GETWHITELISTDETAILS: "/getWhitelistDetails",
    GETCLAIMTOPICSDETAILS: "/getClaimDetails",
    MPLREGISTER: "/mpl/register",
    MPLVERIFYEMAIL: "/mpl/verifyEmail",
    MPLLOGIN: "/mpl/login",
    PORTFOLIOSUMMARY: "/getPortfolioSummary",
    PORTFOLIODETAILS: "/getPortfolioDetails",
    UPDATEADDRESS: "/updateAddress",
    ORDERS: "/getOrders",
    OFFERINGS: "/getOfferingMpl",
    SUBSCRIBE_MPL: "/subscribeMpl",
    BUY_MPL: "/buyMpl",
    BORROWER_HISTORY: "/lender/lenderTransactionHistory",
    GET_ALL_TRANSFER_AGENTS: "/transferAgent",
    INVITE_TRANSFER_AGENTS: "/transferAgent",
    GET_TA_TRANCHES: "/transferAgent/PoolTrancheDetails",
    GET_TA_CAP_TABLE: "/transferAgent/capTable",
    GET_TA_TRANSACTION_HISTORY: "/transferAgent/history",
    GET_TA_ORDERS: "/transferAgent/orders",
    LOANS_SERVICE: "/servicingInfo?tokenId=",
  };
  export const LIMIT = 8;
  const BICONOMY_API_KEY: any = process.env.REACT_APP_BICONOMY_API_KEY as any;
  const POLYGON_URL: any = process.env.REACT_APP_POLYGON_URL as any;
  const CHAIN_ID: any = process.env.REACT_APP_CHAIN_ID as any;
  const PAZZA_ADDRESS: any = process.env.REACT_APP_PAZZA_ADDRESS as any;
  const TRADE_ADDRESS: any = process.env.REACT_APP_TRADE_ADDRESS as any;
  const USDC_ADDRESS: any = process.env.REACT_APP_USDC_ADDRESS as any;
  const EXPLORER: any = process.env.REACT_APP_EXPLORER as any;
  const SITE_URL: any = process.env.REACT_APP_SITE_URL as any;
  // const SITE_URL: any = "http://10.10.1.203:9000/";
  const URL_WEB_SOCKET = process.env.REACT_APP_SOCKET_URL as any;
  const FACTORY_ADDRESS: any = process.env.REACT_APP_FACTORY_ADDRESS as any;
  const LOAN_NFT_ADDRESS: any = process.env.REACT_APP_LOAN_NFT_ADDRESS as any;
  const POOL_OF_LOANS_ADDRESS: any = process.env
    .REACT_APP_POOL_OF_LOANS_ADDRESS as any;
  const TOKENIZATION_CONTROLLER: any = process.env
    .REACT_APP_TOKENIZATION_CONTROLLER as any;
  const COUNTRY_RESTRICT_COMPLIANCE: any = process.env
    .REACT_APP_COUNTRY_RESTRICT_COMPLIANCE as any;
  const currentChainId: any = process.env.REACT_APP_CURRENT_CHIANID;
  const ADMIN_ADDRESS: any = process.env.REACT_APP_ADMIN_ADDRESS;
  const FACTORY_HELPER_ADDRESS: any = process.env.REACT_APP_ADMIN_ADDRESS;
  const BOND_ISSUANCE: any = process.env.REACT_APP_BONDISSUANCE;
  const BONDINGCURVE_ADDRESS: any = process.env.REACT_APP_BONDINGCURVE;
  const GELATO_RELAY_API_KEY: any = process.env.REACT_APP_GELATO_RELAY_API_KEY;
  export {
    BICONOMY_API_KEY,
    POLYGON_URL,
    CHAIN_ID,
    PAZZA_ADDRESS,
    TRADE_ADDRESS,
    USDC_ADDRESS,
    EXPLORER,
    SITE_URL,
    URL_WEB_SOCKET,
    FACTORY_ADDRESS,
    LOAN_NFT_ADDRESS,
    POOL_OF_LOANS_ADDRESS,
    TOKENIZATION_CONTROLLER,
    COUNTRY_RESTRICT_COMPLIANCE,
    currentChainId,
    ADMIN_ADDRESS,
    BOND_ISSUANCE,
    BONDINGCURVE_ADDRESS,
    GELATO_RELAY_API_KEY
  };
  
  export const swapCoins = {
    coin1: "USDC",
    coin2: "PAZA",
  };
  export const perPage = 10;
  