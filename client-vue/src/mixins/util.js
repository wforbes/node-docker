import _ from "lodash";

export const util = {
	methods: {
		isEmpty(v, useLodash = false) {
			return useLodash
				? _.isEmpty(v)
				: typeof v === "undefined" ||
						v === null ||
						(Object.prototype.hasOwnProperty.call(v, "length") &&
							v.length === 0) ||
						(v.constructor === Object && Object.keys(v).length === 0);
		},
		isEqual(a, b) {
			return _.isEqual(a, b);
		},
		isObject(x) {
			return typeof x === "object" && !Array.isArray(x) && x !== null;
		},
		cloneDeep(x) {
			return _.cloneDeep(x);
		},
		has(obj, key) {
			return _.has(obj, key);
		},
		ucFirst(str) {
			return typeof str === "string"
				? str.charAt(0).toUpperCase() + str.slice(1)
				: "";
		},
		lcFirst(str) {
			return str.charAt(0).toLowerCase() + str.slice(1);
		},
		removeSpaces(str) {
			return str.split(" ").join("");
		},
		camelCase(str) {
			return this.lcFirst(str.split(" ").join(""));
		},
		pascalCase(str) {
			return this.ucFirst(str.split(" ").join(""));
		},
		getEmailRegex() {
			// eslint-disable-next-line no-control-regex
			return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
		},
		getNoSpecialCharRegex() {
			return /^[a-zA-Z\d._]+$/;
		},
		getBeginsWithNumberRegex() {
			return /^[\d]+$/;
		},
		getContainsSpecialCharRegex() {
			return /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/g;
		}
	}
};
