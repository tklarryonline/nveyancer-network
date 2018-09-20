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

const NAMESPACE = 'org.nveyancer.network';


/**
 * Open the Trust Account transaction.
 * - Creates an OpenTrustAccountNoticeForm asset
 * - Emits a TrustAccountOpenedEvent
 *
 * @param {org.nveyancer.network.OpenTrustAccountTransaction} tx
 * @transaction
 */
async function openTrustAccount(tx) {
    const factory = getFactory();

    const conveyancer = tx.conveyancer;
    const institution = tx.institution;
    const trustAccountId = `${tx.bsb}-${tx.accountNumber}`;

    // Creates an unverified (default) TrustAccount asset
    let trustAccount = factory.newResource(NAMESPACE, 'TrustAccount', trustAccountId);
    trustAccount.owner = factory.newRelationship(NAMESPACE, 'Conveyancer', conveyancer.$identifier);
    trustAccount.institution = factory.newRelationship(NAMESPACE, 'FinancialInstitution', institution.$identifier);
    trustAccount.name = tx.trustAccountName;
    trustAccount.bsb = tx.bsb;
    trustAccount.accountNumber = tx.accountNumber;

    // Creates an OpenTrustAccountNoticeForm asset
    let form = factory.newResource(NAMESPACE, 'OpenTrustAccountNoticeForm', `OTANF_${tx.transactionId}`);
    form.conveyancer = factory.newRelationship(NAMESPACE, 'Conveyancer', conveyancer.$identifier);
    form.institution = factory.newRelationship(NAMESPACE, 'FinancialInstitution', institution.$identifier);
    form.trustAccount = factory.newRelationship(NAMESPACE, 'TrustAccount', trustAccountId);
    form.ownerSignedDate = tx.timestamp;

    // Commits the new assets
    const trustAccountRegistry = await getAssetRegistry(`${NAMESPACE}.TrustAccount`);
    await trustAccountRegistry.add(trustAccount);

    const formRegistry = await getAssetRegistry(`${NAMESPACE}.OpenTrustAccountNoticeForm`);
    await formRegistry.add(form);

    // Notifies the financial institution with event
    let event = factory.newEvent(NAMESPACE, 'TrustAccountOpenedEvent');
    event.form = form;
    emit(event);
}

/**
 * Endorse the TrustAccount created by Conveyancer.
 * - Add endorsement data to NoticeForm
 * - Emits a TrustAccountEndorsedEvent
 *
 * @param {org.nveyancer.network.EndorseTrustAccountTransaction} tx
 * @transaction
 */
async function endorseTrustAccount(tx) {
    const form = tx.form;

    // Adds endorsement details
    form.isInstitutionEndorsed = tx.endorse;
    form.institutionSignedDate = tx.timestamp;

    // Updates the form
    const formRegistry = await getAssetRegistry(`${NAMESPACE}.OpenTrustAccountNoticeForm`);
    await formRegistry.update(form);

    // Notifies the governance officer that this form is endorsed
    let event = factory.newEvent(NAMESPACE, 'TrustAccountEndorsedEvent');
    event.form = form;
    emit(event);
}

/**
 * Approve the TrustAccount, which is submitted by Conveyancer
 * and endorsed by FinancialInstitution
 * - Add approval data to NoticeForm
 * - Add verification to TrustAccount
 * - Emits a TrustAccountApprovedEvent
 *
 * @param {org.nveyancer.network.ApproveTrustAccountTransaction} tx
 * @transaction
 */
async function approveTrustAccount(tx) {
    const form = tx.form;

    // Adds verification details to the form
    form.officer = tx.officer;
    form.isApproved = tx.approve;
    form.approvalDate = tx.timestamp;

    // Adds verification details to the nominated TrustAccount
    form.trustAccount.isVerified = tx.approve;

    // Updates the form
    const formRegistry = await getAssetRegistry(`${NAMESPACE}.OpenTrustAccountNoticeForm`);
    await formRegistry.update(form);

    // Updates the trust account
    const trustAccountRegistry = await getAssetRegistry(`${NAMESPACE}.TrustAccount`);
    await trustAccountRegistry.update(form.trustAccount);

    // Notifies the governance officer that this form is endorsed
    let event = factory.newEvent(NAMESPACE, 'TrustAccountApprovedEvent');
    event.form = form;
    emit(event);
}
