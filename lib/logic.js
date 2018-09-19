/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Track the changes in BankAccount
 * @param {org.nveyancer.network.UpdateBankAccountTransaction} updateTx
 * @transaction
 */
async function updateBankAccount(updateTx) {
    // Save the old values of the bank account
    const oldValues = {
        bsb: updateTx.bankAccount.bsb,
        accountNumber: updateTx.bankAccount.accountNumber
    };

    // Update the bank account with the new values
    updateTx.bankAccount.bsb = updateTx.bsb;
    updateTx.bankAccount.accountNumber = updateTx.accountNumber;

    // Get the asset registry for the BankAccount
    const assetRegistry = await getAssetRegistry('org.nveyancer.network.BankAccount');
    // Update the asset in the asset registry.
    await assetRegistry.update(updateTx.bankAccount);

    // Emit an event for the modified BankAccount
    let event = getFactory().newEvent('org.nveyancer.network', 'BankAccountUpdatedEvent');
    event.bankAccount = updateTx.bankAccount;
    event.oldBsb = oldValues.bsb;
    event.oldAccountNumber = oldValues.accountNumber;
    event.newBsb = updateTx.bsb;
    event.newAccountNumber = updateTx.accountNumber;
    emit(event);
}
