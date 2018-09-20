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
 * Generates test data
 *
 * Conveyancer:
 * - conveyancer1@email.com
 *
 * FinancialInstitution:
 * - 1585
 *
 * Governance:
 * - officer1@email.gov.au
 *
 * @param {org.nveyancer.network.GenerateTestData} tx
 * @transaction
 */
async function generateTestData(tx) {
    const factory = getFactory();

    // Creates conveyancer

    let conveyancer = factory.newResource(NAMESPACE, 'Conveyancer', 'conveyancer1@test.com');
    conveyancer.name = 'Conveyancer 1';
    let conveyancerAddress;
}
