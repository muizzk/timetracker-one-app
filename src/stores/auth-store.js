import { writable } from 'svelte/store';

const ACTION_CODE_SETTINGS = {
	url: 'http://'+ (window.location.href.includes('localhost') ? 'localhost:10002' : 'app.timetracker.one') +'/sign-in/validate/',
	handleCodeInApp: true
}

export const authStore = writable({
	seemsToHaveAuth: false,
	inited: false,
	hasAuth: false,
	user: null
})



export function authInit() {
	const seemsToHaveAuth = localStorage.getItem('seemsToHaveAuth')
	if(seemsToHaveAuth) {
		authStore.update(data => {
			data.seemsToHaveAuth = true
			return data
		})
	}

	firebase.auth().onAuthStateChanged(user => {
		if (user) {
			user.getIdTokenResult().then(idToken => {
	
				if((idToken.claims.admin && Object.keys(idToken.claims.admin)) > 0 || (idToken.claims.member && Object.keys(idToken.claims.member))) {
					authStore.set({
						seemsToHaveAuth: true,
						inited: true,
						hasAuth: true,
						hasTeam: true,
						user: {
							id: user.uid,
							email: user.email,
							name: user.displayName // user.photoURL
						}
					})
					localStorage.setItem('seemsToHaveAuth', true)
				} else {

					authStore.set({
						seemsToHaveAuth: true,
						inited: true,
						hasAuth: true,
						hasTeam: false,
						user: {
							id: user.uid,
							email: user.email,
							name: user.displayName // user.photoURL
						}
					})

					firebase.db.collection('queue').doc('new-user-' + user.uid).set({
						action: 'newUser',
						user: 'SsmjhJiN6pbT4InSCuZwiFYMMrW2'
						// TODO: KEY FROM INVITATION
					}).then(() => {
						console.log('OKAY')
					}).catch(err => {
						console.error('ERROR: ', err)
					})

				}
			})
		} else {
			authStore.set({
				seemsToHaveAuth: false,
				inited: true,
				hasAuth: false,
				hasTeam: false,
				user: null
			})

			localStorage.setItem('seemsToHaveAuth', false)
		}
	})
}


export function authSignIn(email, password, cb) {
	firebase.auth().signInWithEmailAndPassword(email, password).then(res => {
		cb(true)
	}).catch(err => {
		cb(false, err.code)
	})
}


export function authSignUp(email, password, cb) {
	firebase.auth().createUserWithEmailAndPassword(email, password).then(res => {
		cb(true)
	}).catch(err => {
		cb(false, err.code)
	})
}

export function authSignOut() {
	firebase.auth().signOut();
}


export function authStoreNewPassword(email, cb) {

	const actionCodeSettings = {
		url: 'https://app.timetracker.one/new-password-verification/?email=' + email,
		handleCodeInApp: true
	}

	firebase.auth().sendPasswordResetEmail(email).then(() => {
		cb(true)
	}).catch(function(error) {
		cb(false)
	})
}


export function authStoreVerifyPasswordCode(oobCode, cb) {
	firebase.auth().verifyPasswordResetCode(oobCode).then(res => {
		cb(null)
	}).catch(err => {
		cb(err)
	})
}


export function authStoreConfirmPasswordReset(oobCode, password, cb) {
	firebase.auth().confirmPasswordReset(oobCode, password).then(res => {
		console.log('RES', res)
		cb(null)
	}).catch(err => {
		cb(err)
	})	
}

export function authValidateLink(cb) {

	if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
	
		var email = window.localStorage.getItem('emailForSignIn')
		if (!email) {
			email = window.prompt('Please provide your email for confirmation');
		}

		firebase.auth().signInWithEmailLink(email, window.location.href).then(res => {
			window.localStorage.removeItem('emailForSignIn')
			cb(true)
		}).catch(err => {
			console.log(err)
			cb(false)
		})
	} else {
		cb(false)
	}
}