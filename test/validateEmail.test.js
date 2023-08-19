var assert = require('assert');

/*
    Tests Signup and Login Pathways
*/

let email = "testing_email@gmail.com"
let name = "testing_name"
let password = "password"
let username = "testing_username"

describe('Test Email Validation', async function() {

    before(async function() {
        let res = await fetch('http://localhost:3000/api/authentication/sign-up', {
            method: "POST",
            body: JSON.stringify({
                email: email,
                name: name,
                password: password,
                username: username
            })
        })
        assert.equal(res.ok, true, "singup call should return status 200")
    })


    it("signup -> validate email", async function() {

        let res = await fetch('http://localhost:3000/api/testing/getUserByUsername', {
            method: "POST",
            body: JSON.stringify({
                username: username
            })
        })

        assert.equal(res.ok, true, 'user was not created on signup')
        let user = (await res.json()).user
        assert.notEqual(user, undefined)
        let { emailValidationKey } = user

        res = await fetch('http://localhost:3000/api/authentication/validateEmail', {
            method: "POST",
            body: JSON.stringify({
                email: email,
                secretKey: emailValidationKey
            })
        })
        assert.equal(res.ok, true)

        

        res = await fetch('http://localhost:3000/api/testing/getUserByUsername', {
            method: "POST",
            body: JSON.stringify({
                username: username
            })
        })
        user = (await res.json()).user
        assert.equal(user.emailVerified, true)

    })

    after(async function() {
        //just to make sure this data doesn't linger in the db in case of a failed test
        await fetch('http://localhost:3000/api/testing/deleteUserByUsername', {
            method: "POST",
            body: JSON.stringify({
                username: username
            })
        })
    })
})