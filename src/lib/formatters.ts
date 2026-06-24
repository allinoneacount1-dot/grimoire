import numeral from 'numeral';
import { formatDistanceToNowStrict } from 'date-fns';

export function formatPrice(price: number): string {
  if (price < 0.01) return `$${price.toFixed(6)}`;
  if (price < 1) return `$${price.toFixed(4)}`;
  if (price < 1000) return `$${price.toFixed(2)}`;
  return `$${numeral(price).format('0.00a')}`;
}

export function formatLargeNumber(num: number): string {
  if (num >= 1e9) return `$${numeral(num).format('0.00a')}`;
  if (num >= 1e6) return `$${numeral(num).format('0.00a')}`;
  if (num >= 1e3) return `$${numeral(num).format('0.0a')}`;
  return `$${num.toFixed(2)}`;
}

export function formatPercent(value: number): string {
  const prefix = value >= 0 ? '+' : '';
  return `${prefix}${value.toFixed(2)}%`;
}

export function formatAddress(address: string, chars: number = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function formatTimeAgo(timestamp: number): string {
  return formatDistanceToNowStrict(timestamp, { addSuffix: false })
    .replace(' seconds', 's')
    .replace(' second', 's')
    .replace(' minutes', 'm')
    .replace(' minute', 'm')
    .replace(' hours', 'h')
    .replace(' hour', 'h')
    .replace(' days', 'd')
    .replace(' day', 'd');
}

export function formatNumber(num: number): string {
  return numeral(num).format('0,0');
}
