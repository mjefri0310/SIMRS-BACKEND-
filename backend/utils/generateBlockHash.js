const SHA256 =
require('crypto-js/sha256')
module.exports = ({
index,
previous_hash,
timestamp,
payload,
}) => {
return SHA256(
JSON.stringify({
index,
previous_hash,
timestamp:
new Date(timestamp)
.toISOString(),
payload,
})
).toString()
}