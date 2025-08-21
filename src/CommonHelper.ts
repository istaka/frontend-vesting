export const trimAddress = (walletAddress: any) => {
  return `${walletAddress?.slice(0, 5)}....${walletAddress?.slice(
    walletAddress?.length - 5
  )}`;
};
