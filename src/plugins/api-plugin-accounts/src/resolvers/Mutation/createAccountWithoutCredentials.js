

export default async function createAccountWithoutCredentials(_, { input }, context) {

    const newInput = input;
    Object.assign(newInput, {
        profile: {
            phone: input.phone,
            firstName: input.firstName,
            lastName: input.lastName,
            name: input.name
        }
    });

    delete input.firstName;
    delete input.lastName;
    delete input.phone;

    const account = await context.mutations.createAccount(context, newInput);
    return { account };
}