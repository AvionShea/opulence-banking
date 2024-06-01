"use server";

import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { encryptId, parseStringify } from "../utils";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";
import { plaidClient } from "@/lib/plaid";
import { revalidatePath } from "next/cache";
import { addFundingSource } from "./dwolla.actions";

export const signIn = async ({email, password}: signInProps) => {
    try {
        const { account } = await createAdminClient();

        const session = await account.createEmailPasswordSession(email, password);

        cookies().set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        return parseStringify(session);

    } catch (error) {
        console.error("Error", error);
    }
}

export const signUp = async (userData: SignUpParams) => {
    
    const {email, password, firstName, lastName} = userData;

    let newUserAccount;
    
    try {
        const { account } = await createAdminClient();

        newUserAccount = await account.create(
            ID.unique(), 
            email, 
            password, 
            `${firstName} ${lastName}`
        );
        
        const session = await account.createEmailPasswordSession(email, password);

        cookies().set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        return parseStringify(newUserAccount);

    } catch (error) {
        console.error("Error", error);
    }
}

// ... your initilization functions
export async function getLoggedInUser() {
    try {
      const { account } = await createSessionClient();

      const user = await account.get();
    
      return parseStringify(user);

    } catch (error) {
      return null;
    }
  }
  
  export const logoutAccount = async () => {
    try {
        const { account} = await createSessionClient();

        cookies().delete("appwrite-session");

        await account.deleteSession("current");

    } catch (error) {
        return null;
    }
  }

  export const createLinkToken = async (user: User) => {
    try {
        const tokenParams = {
            user: {
                client_user_id: user.$id
            },
            client_name: user.name,
            products: ["auth"] as Products[],
            language: "en",
            country_codes: ["US"] as CountryCode[],
        }

        const response = await plaidClient.linkTokenCreate(tokenParams);

        return parseStringify({ linkToken: response.data.link_token});

    } catch (error){
        console.log(error);
    }
  }

  export const exchangePublicToken = async ({
    publicToken,
    user,
  }: exchangePublicTokenProps) => {
    try {
        //exchanges public token for access token and item ID
        const response = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken,
        })

        const accessToken = response.data.access_token;
        const itemID = response.data.item_id;

        //get account info from Plaid
        const accountsResponse = await plaidClient.accountsGet({
            access_token: accessToken
        })

        const accountData = accountsResponse.data.accounts[0];

        //Creates processor token for Dwolla using access token and acct. ID
        const request: ProcessorTokenCreateRequest = {
            access_token: accessToken,
            account_id: accountData.account_id,
            processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
        };

        const processorTokenResponse = await plaidClient.processorTokenCreate(request);
        const processorToken = processorTokenResponse.data.processor_token;

        //Creates funding source URL for acct. using Dwolla
        const fundingSourceUrl = await addFundingSource({
            dwollaCustomerId: user.dwollaCustomerId, processorToken,
            bankName: accountData.name
        });

        //throw error if URL is not created
        if (!fundingSourceUrl) throw Error;

        //if funding source exists, create bank acct.
        await createBankAccount({
            userid: user.$id,
            bankId: itemID,
            accountId: accountData.account_id,
            accessToken,
            fundingSourceUrl,
            sharableId: encryptId(accountData.account_id)
        });

        //revalidate path to reflect changes
        revalidatePath("/");

        //return success message
        return parseStringify({
            publicTokenExchange: "bank account added successfully"
        })

    } catch (error) {
        console.error("An error occurred while creating exchanging token:", error);
    }
  }