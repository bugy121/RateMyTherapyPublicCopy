var assert = require('assert');
var bcrypt = require('bcryptjs')

/*
    Tests Signup and Login Pathways
*/

let email = "testing_email@fadfsdfa.com"
let name = "testing_name"
let password = "password"
let username = "testing_username"

describe('Test Reset Password', async function() {

    before(async function() {
        let res = await fetch('http://localhost:3000/api/authentication/sign-up', {
            method: "POST",
            body: JSON.stringify({
                email: email,
                name: name,
                password: password,
                username: username,
                test: true,
            })
        })
        assert.equal(res.ok, true, "singup call should return status 200")

        res = await fetch('http://localhost:3000/api/testing/getUserByUsername', {
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
    })


    it("signup -> validateEmail -> request password reset -> reset password", async function() {

        let res = await fetch('http://localhost:3000/api/authentication/generateResetToken', {
            method: 'POST',
            headers: { email: email, test: true},
        })
        assert.equal(res.ok, true)

        


        res = await fetch('http://localhost:3000/api/testing/getUserByUsername', {
            method: "POST",
            body: JSON.stringify({
                username: username
            })
        })
        let user = (await res.json()).user
        
        res = await fetch('http://localhost:3000/api/authentication/resetPassword', {
            method: "POST",
            body: JSON.stringify({
                email: email,
                password: 'new password',
                secret_key: user.resetToken.secretKey
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
        assert.equal(await bcrypt.compare('new password', user.password), true)

        

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