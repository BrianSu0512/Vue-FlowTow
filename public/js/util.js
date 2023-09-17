/*
 *
 * Module: <util>
 * This module implements the utility functions. This means the location hash will be divided into two part,which are a path and id.
 * This functionn is useful for finding the path or id.
 *
 * Student Name:WEI-CHIA SU
 * Student Number: 46184597
 *
 */

export {splitHash};

// splitHash - given a hash path like "#!/people/2" 
//   return an object with properties `path` ("people") and `id` (2)
function splitHash(hash) {

    const regex = "#!/([^/]*)/?(.*)?";
    const match = hash.match(regex);
    if (match) {
        return {
            path: match[1],
            id: match[2]
        }
    } else {
        return { path: "" }
    }
}
