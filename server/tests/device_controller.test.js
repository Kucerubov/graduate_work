const uuid = require('uuid');
const path = require('path');
const { Device, DeviceInfo } = require("../models/models");
const ApiError = require('../exception/api-error');
const { create } = require("../controllers/device-controller");
const DeviceController = require("../controllers/device-controller");

// Mocking the dependencies
jest.mock('uuid');
jest.mock('path');
jest.mock("../models/models");
jest.mock('../exception/api-error');

describe("DeviceController", () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            body: {},
            files: {
                img: {
                    mv: jest.fn(),
                },
            },
            params: {},
            query: {},
        };
        res = {
            json: jest.fn(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        let req;
        let res;
        let next;

        beforeEach(() => {
            req = {
                body: {},
                files: {},
            };
            res = {
                json: jest.fn(),
            };
            next = jest.fn();
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it("should create a new device and return it", async () => {
            const deviceData = {
                name: "Device 1",
                price: 100,
                brandId: 1,
                typeId: 1,
                info: "[{ \"title\": \"Info 1\", \"description\": \"Description 1\" }]",
            };
            const img = {
                mv: jest.fn(),
            };
            const fileName = "image.jpg";
            const createdDevice = { id: 1, ...deviceData };

            req.body = deviceData;
            req.files.img = img;
            uuid.v4.mockReturnValueOnce("image");
            path.resolve.mockReturnValueOnce("C:/Users/IraKu/WebstormProjects/graduate_work/server/static/" + fileName);
            Device.create.mockResolvedValue(createdDevice);

            await create(req, res, next);

            expect(uuid.v4).toHaveBeenCalled();
            expect(path.resolve).toHaveBeenCalledWith(
                "C:\\Users\\IraKu\\WebstormProjects\\graduate_work\\server\\controllers",
                "..",
                "static",
                fileName
            );
            expect(img.mv).toHaveBeenCalledWith("C:/Users/IraKu/WebstormProjects/graduate_work/server/static/" + fileName);
            expect(Device.create).toHaveBeenCalledWith({
                name: "Device 1",
                price: 100,
                img: "image.jpg",
                brandId: 1,
                typeId: 1,
            });
            expect(DeviceInfo.create).toHaveBeenCalledWith({
                title: "Info 1",
                description: "Description 1",
                deviceId: 1,
            });
            expect(res.json).toHaveBeenCalledWith(createdDevice);
            expect(next).not.toHaveBeenCalled();
        });

        it("should call next with an error if an error occurs", async () => {
            const error = new Error("Something went wrong");

            req.body = {
                name: "Device 1",
                price: 100,
                brandId: 1,
                typeId: 1,
            };
            req.files.img = { mv: jest.fn() };
            Device.create.mockRejectedValue(error);
            ApiError.BadRequest.mockReturnValueOnce(error);

            await create(req, res, next);

            expect(ApiError.BadRequest).toHaveBeenCalledWith(error);
            expect(next).toHaveBeenCalledWith(error);
            expect(res.json).not.toHaveBeenCalled();
        });
    });

    describe("getAll", () => {
        it("should return all devices based on the query parameters", async () => {
            const devices = [{ id: 1, name: "Device 1" }, { id: 2, name: "Device 2" }];

            req.query = {
                brandId: 1,
                typeId: 1,
                limit: 10,
                page: 2,
            };
            Device.findAndCountAll.mockResolvedValue(devices);

            await DeviceController.getAll(req, res, next);

            expect(Device.findAndCountAll).toHaveBeenCalledWith({
                where: { brandId: 1, typeId: 1 },
                limit: 10,
                offset: 10,
            });
            expect(res.json).toHaveBeenCalledWith(devices);
            expect(next).not.toHaveBeenCalled();
        });

        it("should call next with an error if an error occurs", async () => {
            const error = new Error("Something went wrong");

            Device.findAndCountAll.mockRejectedValue(error);

            await DeviceController.getAll(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
            expect(res.json).not.toHaveBeenCalled();
        });
    });

    describe("getOne", () => {
        it("should return a single device with its info", async () => {
            const device = {
                id: 1,
                name: "Device 1",
                info: [{ id: 1, title: "Info 1", description: "Description 1" }],
            };

            req.params.id = 1;
            Device.findOne.mockResolvedValue(device);

            await DeviceController.getOne(req, res, next);

            expect(Device.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                include: [{ model: DeviceInfo, as: "info" }],
            });
            expect(res.json).toHaveBeenCalledWith(device);
            expect(next).not.toHaveBeenCalled();
        });

        it("should call next with an error if an error occurs", async () => {
            const error = new Error("Something went wrong");

            req.params.id = 1;
            Device.findOne.mockRejectedValue(error);

            await DeviceController.getOne(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
            expect(res.json).not.toHaveBeenCalled();
        });
    });
});
