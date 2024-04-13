import { createPublicClient, http, parseUnits } from "viem";
import { getEnsAddress } from "viem/actions";
import { mainnet } from "viem/chains";

/** Returns token units, 6000000 for $6 USDC */
export function dollarsToAmount(
  dollars: number | string,
  tokenDecimals: number = 6
) {
  if (typeof dollars === "number") {
    dollars = dollars.toFixed(tokenDecimals);
  }
  return parseUnits(dollars, tokenDecimals);
}

/** Returns eg "6.00" for 6000123 USDC units. */
export function amountToDollars(
  amount: bigint | number,
  tokenDecimals: number = 6
): `${number}` {
  const dispDecimals = 2;

  const totalCents =
    BigInt(amount) / BigInt(10 ** (tokenDecimals - dispDecimals));
  const dispStr = totalCents.toString().padStart(dispDecimals + 1, "0");
  const dollars = dispStr.slice(0, -dispDecimals);
  const cents = dispStr.slice(-dispDecimals);

  return `${dollars}.${cents}` as `${number}`;
}

export function colorHash(inputString: string) {
  if (!inputString) return "#8F8F91";
  let sum = 0;

  for (let char of inputString) {
    sum += char?.charCodeAt(0);
  }

  let r = ~~(
    parseFloat(
      "0." +
        Math.sin(sum + 1)
          .toString()
          .substr(6)
    ) * 256
  );
  let g = ~~(
    parseFloat(
      "0." +
        Math.sin(sum + 2)
          .toString()
          .substr(6)
    ) * 256
  );
  let b = ~~(
    parseFloat(
      "0." +
        Math.sin(sum + 3)
          .toString()
          .substr(6)
    ) * 256
  );

  const rgb = "rgb(" + r + ", " + g + ", " + b + ")";

  let hex = "#";

  hex += ("00" + r.toString(16)).substr(-2, 2).toUpperCase();
  hex += ("00" + g.toString(16)).substr(-2, 2).toUpperCase();
  hex += ("00" + b.toString(16)).substr(-2, 2).toUpperCase();

  return {
    r,
    g,
    b,
    rgb,
    hex,
  };
}

export const shortenAddress = (address: string) => {
  if (!address) return "undefined";
  return `${address.slice(0, 4)}...${address.slice(-2)}`;
};

export const formatBigInt = (value: bigint, decimalPlaces = 2) => {
  if (!value) return 0;
  const divisorBigInt = BigInt(10 ** 6); // Adjust for decimal places
  const quotientBigInt = value / divisorBigInt;
  const remainderBigInt = value % divisorBigInt;
  const remainderStr = remainderBigInt.toString().padStart(decimalPlaces, "0"); // Pad with leading zeros
  return `${quotientBigInt}.${remainderStr.slice(0, decimalPlaces)}`;
};

export const resolveEnsName = async (name: string): Promise<string | null> => {
  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(),
  });
  return await publicClient.getEnsAddress({
    name,
  });
};
