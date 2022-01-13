import _ from "lodash";

class U {
	static isEmpty(v, useLodash = false) {
		return useLodash
			? _.isEmpty(v)
			: typeof v === "undefined" ||
					v === null ||
					(Object.prototype.hasOwnProperty.call(v, "length") &&
						v.length === 0) ||
					(v.constructor === Object && Object.keys(v).length === 0);
	}
	static isEqual(a, b) {
		return _.isEqual(a, b);
	}
	static cloneDeep(x) {
		return _.cloneDeep(x);
	}
	static has(obj, key) {
		return _.has(obj, key);
	}
	static ucFirst(str) {
		return typeof s === "string"
			? str.charAt(0).toUpperCase() + str.slice(1)
			: "";
	}
	static lcFirst(str) {
		return str.charAt(0).toLowerCase() + str.slice(1);
	}
	static removeSpaces(str) {
		return str.split(" ").join("");
	}
	static camelCase(str) {
		return this.lcFirst(str.split(" ").join(""));
	}
	static pascalCase(str) {
		return this.ucFirst(str.split(" ").join(""));
	}
	static getEmailRegex() {
		// eslint-disable-next-line no-control-regex
		return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
	}
	static getNoSpecialCharRegex() {
		return /^[a-zA-Z\d._]+$/;
	}
	static getBeginsWithNumberRegex() {
		return /^[\d]+$/;
	}
	static getContainsSpecialCharRegex() {
		return /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/g;
	}
}
export default U;
