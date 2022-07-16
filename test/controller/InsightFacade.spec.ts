import {
	IInsightFacade,
	InsightDatasetKind,
	InsightError,
	InsightResult,
	NotFoundError,
	ResultTooLargeError,
} from "../../src/controller/IInsightFacade";
import InsightFacade from "../../src/controller/InsightFacade";
import {expect, use} from "chai";
import {clearDisk, getContentFromArchives} from "../TestUtil";
import chaiAsPromised from "chai-as-promised";
import {folderTest} from "@ubccpsc310/folder-test";

use(chaiAsPromised);

type Input = unknown;
type Output = Promise<InsightResult[]>;
type Error = "InsightError" | "ResultTooLargeError";

describe("InsightFacade", function () {
	let courses: string;
	let facade: IInsightFacade;

	before(function () {
		courses = getContentFromArchives("courses.zip");
	});

	describe("Add Dataset", function () {
		beforeEach(function () {
			clearDisk();
			facade = new InsightFacade();
		});

		it("should accept a valid dataset", function () {
			return facade.addDataset("valid-ds", courses, InsightDatasetKind.Courses).then((addedID) => {
				expect(addedID).to.deep.equal(["valid-ds"]);
				expect(addedID).to.be.an.instanceof(Array);
				expect(addedID).to.have.length(1);
			});
		});


		it("should accept a dataset that has some valid course files despite invalid ones NEW", function () {
			let someValidCourses = getContentFromArchives("someValidCourses.zip");

			return facade.addDataset("valid-ds", someValidCourses, InsightDatasetKind.Courses).then((addedID) => {
				expect(addedID).to.be.an.instanceof(Array);
				expect(addedID).to.deep.equal(["valid-ds"]);
				expect(addedID).to.have.length(1);
			});
		});

		it("should accept a dataset that contains at least one valid course section", function () {
			let oneCourseValidSection = getContentFromArchives("onlyOne.zip");

			return facade.addDataset("valid-ds", oneCourseValidSection, InsightDatasetKind.Courses).then((addedID) => {
				expect(addedID).to.deep.equal(["valid-ds"]);
				expect(addedID).to.be.an.instanceof(Array);
				expect(addedID).to.have.length(1);
			});
		});

		it("should accept a dataset that contains only one course with a single valid section", function () {
			let oneCourseOneSection = getContentFromArchives("oneCourseOneSection.zip");

			return facade.addDataset("valid-ds", oneCourseOneSection, InsightDatasetKind.Courses).then((addedIDs) => {
				expect(addedIDs).to.deep.equal(["valid-ds"]);
				expect(addedIDs).to.be.an.instanceof(Array);
				expect(addedIDs).to.have.length(1);
			});
		});

		it("should accept a dataset that contains one valid course and one invalid course", function () {
			let oneValidOneInvalid = getContentFromArchives("oneValidOneInvalid.zip");

			return facade.addDataset("valid-ds", oneValidOneInvalid, InsightDatasetKind.Courses).then((addedIDs) => {
				expect(addedIDs).to.deep.equal(["valid-ds"]);
				expect(addedIDs).to.be.an.instanceof(Array);
				expect(addedIDs).to.have.length(1);
			});
		});

		it("should accept a dataset with one empty, one valid with a single section course file", function () {
			let oneEmptyOneValidSingle = getContentFromArchives("oneEmptyOneValidSingle.zip");

			return facade
				.addDataset("valid-ds", oneEmptyOneValidSingle, InsightDatasetKind.Courses)
				.then((addedIDs) => {
					expect(addedIDs).to.deep.equal(["valid-ds"]);
					expect(addedIDs).to.be.an.instanceof(Array);
					expect(addedIDs).to.have.length(1);
				});
		});

		it("should accept a dataset that contains one course with one valid one invalid section", function () {
			let oneValidOneInvalidSection = getContentFromArchives("oneValidOneInvalidSection.zip");

			return facade
				.addDataset("valid-ds", oneValidOneInvalidSection, InsightDatasetKind.Courses)
				.then((addedIDs) => {
					expect(addedIDs).to.deep.equal(["valid-ds"]);
					expect(addedIDs).to.be.an.instanceof(Array);
					expect(addedIDs).to.have.length(1);
				});
		});

		it("should reject a dataset file that is not of type zip", function () {
			let notZip = getContentFromArchives("notZip.mp3");

			const result = facade.addDataset("invalid-ds", notZip, InsightDatasetKind.Courses);
			return expect(result).eventually.to.be.rejectedWith(InsightError);


			// Using chai-as-promised instead

			// return facade.addDataset("invalid-ds", notZip, InsightDatasetKind.Courses)
			//     .then((res) => {
			//         throw new Error(`Resolved with: ${res}`)
			//     })
			//     .catch((error) => {
			//         expect(error).to.be.an.instanceof(InsightError);
			//     });
		});

		it("should reject a dataset file that is a corrupt zip", function () {
			let corruptZip = getContentFromArchives("corrupt.zip");

			const result = facade.addDataset("invalid-ds", corruptZip, InsightDatasetKind.Courses);
			return expect(result).eventually.to.be.rejectedWith(InsightError);
		});

		it("should reject a dataset file that doesn't have courses/ as it's root dir", function () {
			let falseRootDir = getContentFromArchives("courses-comm.zip");

			const result = facade.addDataset("invalid-ds", falseRootDir, InsightDatasetKind.Courses);
			return expect(result).eventually.to.be.rejectedWith(InsightError);

			// return facade.addDataset("invalid-ds", falseRootDir, InsightDatasetKind.Courses)
			//     .then((res) => {
			//         throw new Error(`Resolved with: ${res}`)
			//     })
			//     .catch((error) => {
			//         expect(error).to.be.an.instanceof(InsightError);
			//     });
		});

		it("should reject a dataset that has no json course files", function () {
			let noCourses = getContentFromArchives("noCourses.zip");

			const result = facade.addDataset("invalid-ds", noCourses, InsightDatasetKind.Courses);
			return expect(result).eventually.to.be.rejectedWith(InsightError);

			// return facade.addDataset("invalid-ds", noCourses, InsightDatasetKind.Courses)
			//     .then((res) => {
			//         throw new Error(`Resolved with: ${res}`)
			//     })
			//     .catch((error) => {
			//         expect(error).to.be.an.instanceof(InsightError);
			//     });
		});

		it("should reject a dataset that has no valid json course files", function () {
			let noValidCourses = getContentFromArchives("noValidCourses.zip");

			const result = facade.addDataset("invalid-ds", noValidCourses, InsightDatasetKind.Courses);
			return expect(result).eventually.to.be.rejectedWith(InsightError);

			// return facade.addDataset("invalid-ds", noValidCourses, InsightDatasetKind.Courses)
			//     .then((res) => {
			//         throw new Error(`Resolved with: ${res}`)
			//     })
			//     .catch((error) => {
			//         expect(error).to.be.an.instanceof(InsightError);
			//     });
		});

		it("should reject a dataset that has no valid json course files (file is empty)", function () {
			let noValidCourses2 = getContentFromArchives("noValidCourses2.zip");

			const result = facade.addDataset("invalid-ds", noValidCourses2, InsightDatasetKind.Courses);
			return expect(result).eventually.to.be.rejectedWith(InsightError);

			// return facade.addDataset("invalid-ds", noValidCourses, InsightDatasetKind.Courses)
			//     .then((res) => {
			//         throw new Error(`Resolved with: ${res}`)
			//     })
			//     .catch((error) => {
			//         expect(error).to.be.an.instanceof(InsightError);
			//     });
		});

		it("should reject a dataset with duplicate id", function () {
			return facade
				.addDataset("valid-ds", courses, InsightDatasetKind.Courses)
				.then((addedIDs) => {
					expect(addedIDs).to.have.length(1);
					return facade.addDataset("valid-ds", courses, InsightDatasetKind.Courses);
				})
				.then((res) => {
					throw new Error(`Resolved with: ${res}`);
				})
				.catch((error) => {
					expect(error).to.be.an.instanceof(InsightError);
				});
		});

		it("should reject a dataset id that contains an underscore", function () {
			const result = facade.addDataset("valid_ds", courses, InsightDatasetKind.Courses);
			return expect(result).eventually.to.be.rejectedWith(InsightError);

			// return facade.addDataset("valid_ds", courses, InsightDatasetKind.Courses)
			// 	.then((res) => {
			// 		throw new Error(`Resolved with: ${res}`);
			// 	})
			// 	.catch((error) => {
			// 		expect(error).to.be.an.instanceof(InsightError);
			// 	});
		});

		it("should reject a dataset id that is only whitespace characters", function () {
			const result = facade.addDataset("  ", courses, InsightDatasetKind.Courses);
			return expect(result).eventually.to.be.rejectedWith(InsightError);

			// return facade.addDataset("  ", courses, InsightDatasetKind.Courses)
			//     .then((res) =>  {
			//         throw new Error(`Resolved with: ${res}`)
			//     })
			//     .catch((error) => {
			//         expect(error).to.be.an.instanceof(InsightError);
			//     });
		});

		it("should reject a dataset id that is an empty string", function () {
			const result = facade.addDataset("", courses, InsightDatasetKind.Courses);
			return expect(result).eventually.to.be.rejectedWith(InsightError);

			// return facade.addDataset("", courses, InsightDatasetKind.Courses)
			//     .then((res) =>  {
			//         throw new Error(`Resolved with: ${res}`)
			//     })
			//     .catch((error) => {
			//         expect(error).to.be.an.instanceof(InsightError);
			//     });
		});

		it ( "should add 1 dataset", async function() {
			// check that it returns a string array
			// check that it contains ids of added datasets

			const ids = await facade.addDataset("courses", courses, InsightDatasetKind.Courses);

			expect(ids).to.deep.equal(["courses"]);
			expect(ids).to.be.an.instanceOf(Array);
			expect(ids).to.have.length(1);


		});

		// it ( "should add 2 datasets", async function() {
		// 	await facade.addDataset("courses", courses, InsightDatasetKind.Courses);
		// 	const ids2 = await facade.addDataset("courses-2", courses, InsightDatasetKind.Courses);
		//
		// 	expect(ids2).to.deep.equal(["courses", "courses-2"]);
		// 	expect(ids2).to.be.an.instanceOf(Array);
		// 	expect(ids2).to.have.length(2);
		//
		//
		// });

		it ( "should reject if id contains an underscore", async function() {

			// The promise should reject with an InsightError describing the error.
			// PROB OTHER INVALID ID INPUTS SPECIFIED IN EBNF

			try {
				await facade.addDataset("c_ourses", courses, InsightDatasetKind.Courses);
				expect.fail("Should have rejected!");
			} catch (err) {
				expect(err).to.be.instanceof(InsightError);
			}

		});

		it ( "should reject if id is only whitespace characters", async function() {

			// The promise should reject with an InsightError describing the error.
			try {
				await facade.addDataset("         ", courses, InsightDatasetKind.Courses);
				expect.fail("Should have rejected!");
			} catch (err) {
				expect(err).to.be.instanceof(InsightError);
			}


		});

		it ( "should reject if id is the same as the id of an already added dataset", async function() {

			// The promise should reject with an InsightError describing the error.
			try {
				await facade.addDataset("courses", courses, InsightDatasetKind.Courses);
				await facade.addDataset("courses", courses, InsightDatasetKind.Courses);
				expect.fail("Should have rejected!");
			} catch (err) {
				expect(err).to.be.instanceof(InsightError);
			}


		});

		// it shouldn't throw an error anymore. Nvm didn't have enough time :(
		it ( "should reject if dataset kind is rooms", async function() {

			// The promise should reject with an InsightError describing the error.
			// For this checkpoint the dataset kind will be courses, and the rooms kind is invalid

			try {
				await facade.addDataset("courses", courses, InsightDatasetKind.Rooms);
				expect.fail("Should have rejected!");
			} catch (err) {
				expect(err).to.be.instanceof(InsightError);
			}

		});

	});

	describe("Remove Dataset", function () {
		beforeEach(function () {
			clearDisk();
			facade = new InsightFacade();
		});

		// it("should remove the dataset with given id", function () {
		// 	return facade
		// 		.addDataset("valid-ds", courses, InsightDatasetKind.Courses)
		// 		.then(() => facade.addDataset("delete-this", courses, InsightDatasetKind.Courses))
		// 		.then((insightDatasets) => {
		// 			expect(insightDatasets).to.be.an.instanceof(Array);
		// 			expect(insightDatasets).to.have.length(2);
		// 			return facade.removeDataset("delete-this");
		// 		})
		// 		.then(() => facade.listDatasets())
		// 		.then((insightDatasets) => {
		// 			expect(insightDatasets).to.be.an.instanceof(Array);
		// 			expect(insightDatasets).to.have.length(1);
		//
		// 			// expect(insightDatasets).to.not.have("delete-this");  Unsure how this works, safer to comment out
		// 			expect(insightDatasets).to.deep.equal([
		// 				{
		// 					id: "valid-ds",
		// 					kind: InsightDatasetKind.Courses,
		// 					numRows: 64612,
		// 				},
		// 			]);
		// 		});
		// });

		it("should reject the removal attempt where the id is not added yet", function () {
			return facade.addDataset("remove-this", courses, InsightDatasetKind.Courses).then(() => {
				return facade
					.removeDataset("rmvths")
					.then((res) => {
						throw new Error(`Resolved with: ${res}`);
					})
					.catch((error) => {
						expect(error).to.be.an.instanceof(NotFoundError);
					});
			});
		});

		it("should reject the removal attempt where parameter id contains underscore", function () {
			return facade.addDataset("remove-this", courses, InsightDatasetKind.Courses).then(() => {
				return facade
					.removeDataset("remove_this")
					.then((res) => {
						throw new Error(`Resolved with: ${res}`);
					})
					.catch((error) => {
						expect(error).to.be.an.instanceof(InsightError);
					});
			});
		});

		it("should reject the removal attempt where parameter id is only whitespace", function () {
			return facade.addDataset("remove-this", courses, InsightDatasetKind.Courses).then(() => {
				return facade
					.removeDataset("  ")
					.then((res) => {
						throw new Error(`Resolved with: ${res}`);
					})
					.catch((error) => {
						expect(error).to.be.an.instanceof(InsightError);
					});
			});
		});

		it("should reject the removal attempt where parameter id is empty string", function () {
			return facade.addDataset("remove-this", courses, InsightDatasetKind.Courses).then(() => {
				return facade
					.removeDataset("")
					.then((res) => {
						throw new Error(`Resolved with: ${res}`);
					})
					.catch((error) => {
						expect(error).to.be.an.instanceof(InsightError);
					});
			});
		});

		it ( "should reject if try to remove a dataset that hasn't been added yet", async function() {
			// NotFoundError

			try {
				await facade.removeDataset("course");
				expect.fail("Should have rejected!");
			} catch (err) {
				expect(err).to.be.instanceof(NotFoundError);
			}


		});

		it ( "should reject if id contains an underscore: remove", async function() {

			// The promise should reject with an InsightError describing the error.
			// InsightError (invalid id or any other source of failure) describing the error.
			// PROB OTHER INVALID ID INPUTS SPECIFIED IN EBNF

			try {
				await facade.removeDataset("cou_rse");
				expect.fail("Should have rejected!");
			} catch (err) {
				expect(err).to.be.instanceof(InsightError);
			}


		});

		it ( "should reject if id is only whitespace characters: remove", async function() {

			// The promise should reject with an InsightError describing the error.

			try {
				await facade.removeDataset("        ");
				expect.fail("Should have rejected!");
			} catch (err) {
				expect(err).to.be.instanceof(InsightError);
			}


		});


	});

	describe("Perform Query", function () {
		before(async function () {
			clearDisk();
			facade = new InsightFacade();
			await facade.addDataset("valid-ds", courses, InsightDatasetKind.Courses);
		});

		it("should pass simple", function() {
			facade.performQuery({
				WHERE:{
					GT:{
						courses_avg:97
					},
				},
				OPTIONS:{
					COLUMNS:[
						"courses_dept",
						"courses_avg"
					],
					ORDER:"courses_avg"
				}
			});
		});

		// it("should get dataset from disk", function() {
		// 	facade.listDatasets();
		// });

		it("should pass complex", function() {
			facade.performQuery({
				WHERE:{
					OR:[
						{
							AND:[
								{
									GT:{
										courses_avg:90
									}
								},
								{
									IS:{
										courses_dept:"adhe"
									}
								}
							]
						},
						{
							EQ:{
								courses_avg:95
							}
						}
					]
				},
				OPTIONS:{
					COLUMNS:[
						"courses_dept",
						"courses_id",
						"courses_avg"
					],
					ORDER:"courses_avg"
				}
			} );
		});

		it("should fail ", async function() {
			try {
				await facade.performQuery({
					WHERE:{
						COLUMNS:[
							"courses_dept",
							"courses_avg"
						]
					},
					OPTIONS:{
						COLUMNS:[
							"courses_dept",
							"courses_avg"
						],
						ORDER:"courses_avg"
					}
				});
				expect.fail("Should have rejected!");
			} catch (err) {
				expect(err).to.be.instanceof(InsightError);
			}
		});

		it("should fulfill valid and reject invalid queries", function () {
			folderTest<Input, Output, Error>(
				"Perform Query Tests",
				(input: Input): Output => {
					return facade.performQuery(input);
				},
				"./test/resources/otherTests",
				{
					assertOnResult: (actual, expected) => {
						expect(actual).to.be.deep.equal(expected);
					},
					assertOnError: (actual, expected) => {
						if (expected === "InsightError") {
							expect(actual).to.be.an.instanceof(InsightError);
						} else if (expected === "ResultTooLargeError") {
							expect(actual).to.be.an.instanceof(ResultTooLargeError);
						}
					},
				}
			);
		});
	});

	describe("List Datasets", function () {
		beforeEach(function () {
			clearDisk();
			facade = new InsightFacade();
		});

		it("should list no datasets", function () {
			// return facade.listDatasets().then((insightDatasets) => {
			//     expect(insightDatasets).to.deep.equal([]);
			// });

			// This is basically the same solution but utilizes chaiAsPromised instead
			const futureInsightDatasets = facade.listDatasets();
			return expect(futureInsightDatasets).to.eventually.deep.equal([]);
		});

		it("should list one dataset", function () {
			return facade
				.addDataset("courses", courses, InsightDatasetKind.Courses)
				.then(() => facade.listDatasets())
				.then((insightDatasets) => {
					expect(insightDatasets).to.deep.equal([
						{
							id: "courses",
							kind: InsightDatasetKind.Courses,
							numRows: 64612,
						},
					]);

					expect(insightDatasets).to.be.an.instanceof(Array);
					expect(insightDatasets).to.have.length(1);
				});
		});

		// it("should list multiple datasets", function () {
		// 	return facade
		// 		.addDataset("courses", courses, InsightDatasetKind.Courses)
		// 		.then(() => {
		// 			return facade.addDataset("courses-2", courses, InsightDatasetKind.Courses);
		// 		})
		// 		.then(() => {
		// 			return facade.listDatasets();
		// 		})
		// 		.then((insightDatasets) => {
		// 			expect(insightDatasets).to.be.an.instanceof(Array);
		// 			expect(insightDatasets).to.have.length(2);
		//
		// 			const insightDatasetCourses = insightDatasets.find((dataset) => dataset.id === "courses");
		// 			expect(insightDatasetCourses).to.exist;
		// 			expect(insightDatasetCourses).to.deep.equal({
		// 				id: "courses",
		// 				kind: InsightDatasetKind.Courses,
		// 				numRows: 64612,
		// 			});
		// 			const insightDatasetCourses2 = insightDatasets.find((dataset) => dataset.id === "courses-2");
		// 			expect(insightDatasetCourses2).to.exist;
		// 			expect(insightDatasetCourses2).to.deep.equal({
		// 				id: "courses-2",
		// 				kind: InsightDatasetKind.Courses,
		// 				numRows: 64612,
		// 			});
		// 		});
		// });
	});
});
