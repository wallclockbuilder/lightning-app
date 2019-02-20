/**
 * @fileOverview computed values that are used in wallet UI components.
 */

import { extendObservable } from 'mobx';
import { toAmountLabel } from '../helper';
import {
  UNITS,
  FIATS,
  MIN_PASSWORD_LENGTH,
  STRONG_PASSWORD_LENGTH,
} from '../config';

const ComputedWallet = store => {
  extendObservable(store, {
    get walletAddressUri() {
      return store.walletAddress ? `bitcoin:${store.walletAddress}` : '';
    },
    get depositLabel() {
      const { balanceSatoshis, pendingBalanceSatoshis, settings } = store;
      return toAmountLabel(balanceSatoshis + pendingBalanceSatoshis, settings);
    },
    get channelBalanceLabel() {
      return toAmountLabel(store.channelBalanceSatoshis, store.settings);
    },
    get unitFiatLabel() {
      const { displayFiat, unit, fiat } = store.settings;
      return displayFiat ? FIATS[fiat].display : UNITS[unit].display;
    },
    get unitLabel() {
      const { settings } = store;
      return !settings.displayFiat ? UNITS[settings.unit].display : null;
    },
    get newPasswordCopy() {
      const { newPassword } = store.wallet;
      return getNewPasswordCopy({ newPassword });
    },
    get newPasswordSuccess() {
      const { newPassword } = store.wallet;
      if (!newPassword) {
        return null;
      }
      return newPassword.length >= MIN_PASSWORD_LENGTH;
    },
    get balancePaddingTop() {
      return calculateTopPadding({ height: store.balanceHeight });
    },
  });
};

/**
 * If necessary, return copy advising the user on the quality of their password.
 * @param  {string} options.walletPassword The password used to encrypt the wallet
 * @return {string}
 */
const getNewPasswordCopy = ({ newPassword }) => {
  if (newPassword.length >= STRONG_PASSWORD_LENGTH) {
    return "Now that's a strong password!";
  } else if (newPassword.length >= MIN_PASSWORD_LENGTH) {
    return 'Pro tip: add a few more characters to strengthen your password.';
  }
  return '';
};

/**
 * Calculate the appropriate top padding for the btc unit that sits next to the main
 * home screen balance. This is needed because the height of the balance adjusts
 * dynamically to its width.
 * @param  {number} height The height of the balance.
 * @return {number}        The amount of padding to put at the top of the unit.
 */
const calculateTopPadding = ({ height }) => {
  if (height >= 80) {
    return 15;
  } else if (height >= 60) {
    return 10;
  }
  return 5;
};

export default ComputedWallet;
