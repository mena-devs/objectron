/**
 * Compares a set of match rules contained with an object to determine if
 * the latter conforms to the matching rules
 *
 * @param {*} payload Object to test
 * @param {*} pattern Object containing the matching rules
 * @param {*} callback Function to call when the traversal and matching is complete
 */
const match = (payload, pattern, callback) => {
  const result = { match: true, total: 0, matches: {}, groups: {} }
  const node = result.matches

  /**
   * Recursive functions that will traverse the tree
   * @param {*} payload Object to test
   * @param {*} pattern Object containing the matching rules
   * @param {*} currentNode Contains the nested objects
   */
  const tester = (payload, pattern, currentNode) => {
    /**
     * Loop over the elements of the testing object
     */
    Object.entries(pattern).forEach(([key, value]) => {
      if (!(key in payload)) {
        result.match = false
        return
      }
      /**
       * Level 1 depth RegExp handling
       * executes a regular match then concatenates the matches
       * with the result object
       */
      if (value instanceof RegExp) {
        const matcher = value.exec(payload[key]) || []
        if (matcher.length > 0) {
          result.groups = { ...result.groups, ...matcher.groups }
          currentNode[key] = payload[key]
          result.total += 1
        } else {
          result.match = false
        }
      /**
       * Level 1 depth array handling
       */
      } else if (value instanceof Array) {
        currentNode[key] = []
        value.forEach((element, index) => {
          /**
           * Level N depth RegExp handling
           */
          if (element instanceof RegExp) {
            const matcher = element.exec(payload[key][index]) || []
            if (matcher.length > 0) {
              result.groups = { ...result.groups, ...matcher.groups }
              currentNode[key] = payload[key]
              result.total += 1
            } else {
              result.match = false
            }
          /**
           * Level N depth Object and Array handling
           */
          } else if (element instanceof Object) {
            currentNode[key][index] = {}

            payload[key].forEach((payloadItem, payloadIndex) => {
              if(payloadItem instanceof Object) {
                const payloadItemMatch = match(payloadItem, element)
                if(payloadItemMatch.match) {
                  tester(payload[key][payloadIndex], element, currentNode[key][index])
                }
              }
            })
          } else if (payload[key].includes(element)) {
            currentNode[key][index] = element
            result.total += 1
          } else {
            result.match = false
          }
        })
      /**
       * Level 1 depth tester functions handling
       */
      } else if (value instanceof Function) {
        if (!value(payload[key])) {
          result.match = false
        } else {
          currentNode[key] = payload[key]
          result.total += 1
        }
      } else if (value instanceof Object) {
        currentNode[key] = {}
        tester(payload[key], value, currentNode[key])
      } else {
        if (payload[key] !== value) {
          result.match = false
        } else {
          currentNode[key] = payload[key]
          result.total += 1
        }
      }
    })
  }

  // Invoke the tester method - execution starts here
  tester(payload, pattern, node)

  // Invoke callback
  if (callback && result.match) {
    callback(result)
  }

  return result
}

module.exports = match
