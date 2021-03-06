/*
 * catberry
 *
 * Copyright (c) 2014 Denis Rechkunov and project contributors.
 *
 * catberry's license follows:
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * This license applies to all parts of catberry that are not externally
 * maintained libraries.
 */

'use strict';

var assert = require('assert'),
	CookieWrapper = require('../../lib/CookieWrapper');

describe('lib/CookieWrapper', function () {
	describe('#get', function () {
		it('should return empty string if cookie string is null', function () {
			var cookieWrapper = new CookieWrapper();
			cookieWrapper.initWithString(null);
			assert.strictEqual(cookieWrapper.get('some'), '');
		});
		it('should return empty string if cookie key is not a string',
			function () {
				var cookieWrapper = new CookieWrapper();
				cookieWrapper.initWithString('some=value;');
				assert.strictEqual(cookieWrapper.get({}), '');
			});
		it('should return value if cookie string is right', function () {
			var cookieWrapper = new CookieWrapper();
			cookieWrapper.initWithString('some=value; some2=value2');
			assert.strictEqual(cookieWrapper.get('some'), 'value');
			assert.strictEqual(cookieWrapper.get('some2'), 'value2');
		});
		it('should return empty string if cookie string is wrong', function () {
			var cookieWrapper = new CookieWrapper();
			cookieWrapper.initWithString('fasdfa/gafg-sgafga');
			assert.strictEqual(cookieWrapper.get('fasdfa/gafg-sgafga'), '');
		});
	});
	describe('#set', function () {
		it('should set cookie by specified parameters',
			function () {
				var cookieWrapper = new CookieWrapper(),
					expiration = new Date(),
					expected = 'some=value' +
						'; Max-Age=100' +
						'; Expires=' +
						expiration.toUTCString() +
						'; Path=/some' +
						'; Domain=.new.domain' +
						'; Secure; HttpOnly';

				cookieWrapper.initWithString(null);

				cookieWrapper.set({
					key: 'some',
					value: 'value',
					maxAge: 100,
					expires: expiration,
					domain: '.new.domain',
					path: '/some',
					secure: true,
					httpOnly: true
				});

				assert.strictEqual(cookieWrapper.setCookie.length, 1);
				assert.strictEqual(cookieWrapper.setCookie[0], expected);
			});
		it('should set several cookies by specified parameters',
			function () {
				var cookieWrapper = new CookieWrapper(),
					expected1 = 'some=value',
					expected2 = 'some2=value2';

				cookieWrapper.initWithString(null);

				cookieWrapper.set({
					key: 'some',
					value: 'value'
				});
				cookieWrapper.set({
					key: 'some2',
					value: 'value2'
				});

				assert.strictEqual(cookieWrapper.setCookie.length, 2);
				assert.strictEqual(cookieWrapper.setCookie[0], expected1);
				assert.strictEqual(cookieWrapper.setCookie[1], expected2);
			});
		it('should set default expire date by max age',
			function () {
				var cookieWrapper = new CookieWrapper(),
					expiration = new Date(Date.now() + 3600000),
					expected = 'some=value' +
						'; Max-Age=3600' +
						'; Expires=' +
						expiration.toUTCString();

				cookieWrapper.set({
					key: 'some',
					value: 'value',
					maxAge: 3600
				});

				assert.strictEqual(cookieWrapper.setCookie.length, 1);
				assert.strictEqual(cookieWrapper.setCookie[0], expected);
			});
		it('should throw error if wrong key',
			function () {
				var cookieWrapper = new CookieWrapper();

				assert.throws(function () {
					cookieWrapper.set({
						key: {}
					});
				}, Error);
			});
		it('should throw error if wrong value',
			function () {
				var cookieWrapper = new CookieWrapper();

				assert.throws(function () {
					cookieWrapper.set({
						key: 'some',
						value: {}
					});
				}, Error);
			});
	});
	describe('#getCookieString', function () {
		it('should return right cookie string with init', function () {
			var cookieWrapper = new CookieWrapper();
			cookieWrapper.initWithString('some=value; some2=value2');
			assert.strictEqual(
				cookieWrapper.getCookieString(),
				'some=value; some2=value2'
			);
		});
		it('should return right cookie string ' +
		'without init but with set', function () {
			var cookieWrapper = new CookieWrapper();
			cookieWrapper.set({
				key: 'some3',
				value: 'value3'
			});
			cookieWrapper.set({
				key: 'some4',
				value: 'value4'
			});
			assert.strictEqual(
				cookieWrapper.getCookieString(),
				'some3=value3; some4=value4'
			);
		});
		it('should return right cookie string after init and set', function () {
			var cookieWrapper = new CookieWrapper();
			cookieWrapper.initWithString('some=value; some2=value2');
			cookieWrapper.set({
				key: 'some3',
				value: 'value3'
			});
			cookieWrapper.set({
				key: 'some4',
				value: 'value4'
			});
			assert.strictEqual(
				cookieWrapper.getCookieString(),
				'some=value; some2=value2; some3=value3; some4=value4'
			);
		});
	});
	describe('#getAll', function () {
		it('should return right cookie string', function () {
			var cookieWrapper = new CookieWrapper();
			cookieWrapper.initWithString('some=value; some2=value2');
			assert.deepEqual(
				cookieWrapper.getAll(), {
					some: 'value',
					some2: 'value2'
				}
			);
		});
	});
});