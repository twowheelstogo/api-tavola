import ReactionError from "@reactioncommerce/reaction-error";

/**
 * @summary Gets a current order counter to set auto-increment id
 * @param {Object} context - current context
 * @returns {Number} returns a sequence value 
 */
export default async function getOrderIdSequence(context) {
    const { collections } = context;
    const { Counters } = collections;

    const { value: updatedCounter } = await Counters.findOneAndUpdate({
        collection: "Orders"
    }, {
        $inc: { seq_value: 1 }
    }, {
        returnOriginal: false
    });

    if (!updatedCounter) throw new ReactionError("server-error", "Error inesperado al crear contador");

    return updatedCounter.seq_value;
}