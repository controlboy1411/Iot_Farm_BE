CREATE DATABASE dbFarmIOTDashboard;

USE [dbFarmIOTDashboard]
GO

-- 2023/08/31: tunghv update table Farm and migrate data
CREATE TABLE [dbo].[Farm](
	Farm_Id int NOT NULL IDENTITY(1,1) PRIMARY KEY,
	Farm_Name nvarchar(100) NULL,
	Address nvarchar(200) NULL,
	Farm_Area varchar(100) NULL,
	Total_House_Area nvarchar(100) NULL,
	Farm_Scale nvarchar(100) NULL,
	Production_Scale nvarchar(100) NULL,
	Total_Employees int NULL,
	Start_Time datetime NULL,
	Is_Active smallint null,
	Background_Img_Url varchar(MAX) NULL,
	Is_Deleted smallint NULL
);

-- 2023/08/31: tunghv update table Farm and migrate data
 CREATE TABLE [dbo].[House] (
	House_Id int identity(1,1) NOT NULL PRIMARY KEY,
	Farm_Id int NULL,
	Chicken_Standard_Id int NULL,
	House_Name nvarchar(100) NULL,
	Total_Rooster int NULL,
	Total_Hen int NULL,
	Total_Rooster_Die int NULL,
	Total_Hen_Die int NULL,
	Active_Date datetime NULL,
	Medicine_Id int NULL,
	Feed_Id int NULL,
	Is_Active smallint NULL,
	Batch_No varchar(50) NULL,
	Week_No int NULL,
	Is_Deleted smallint NULL,
	House_Number int NULL
);

-- 2023/08/31: tunghv update table Farm and migrate data
CREATE TABLE [dbo].[House_Transaction](
	Id int identity(1,1) NOT NULL PRIMARY KEY,
	House_Id int NULL,
	Device_Id nvarchar(50) NULL,
	Temperature float NULL,
	Humidity float NULL,
	NH3 float NULL,
	CO2 float NULL,
	Light_Status varchar(50) NULL,
	Light_Intensity float NULL,
	Wind_Status varchar(50) NULL,
	Wind_Speed float NULL,
	Measurement_Time datetime NULL,
	Water_Flow decimal(18, 2) NULL,
	Water_Status varchar(50) NULL
);


CREATE TABLE [dbo].[Chicken_Stage_Standard](
	Chicken_Stage_Standard_Id int NOT NULL PRIMARY KEY,
	Start_Week int NULL,
	End_Week int NULL,
	Start_Temperature float NULL,
	End_Temperature float NULL,
	Start_Wind_Speed float NULL,
	End_Wind_Speed float NULL,
	Start_Humidity float NULL,
	End_Humidity float NULL,
	Start_Light_Intensity float NULL,
	End_Light_Intensity float NULL,
	Start_CO2 float NULL,
	End_CO2 float NULL,
	Start_NH3 float NULL,
	End_NH3 float NULL
);

-- 2023/10/06: tunghv create table User
CREATE TABLE [dbo].[User](
	User_Id int NOT NULL IDENTITY(1,1) PRIMARY KEY,
	Full_Name nvarchar(100) NULL,
	User_Name varchar(100) NULL,
	Password_Hash varchar(MAX) NULL,
	Role_Id int NULL,
	Address nvarchar(200) NULL,
	Phone_Number varchar(15) NULL,
	Email varchar(100) NULL,
	Date_Of_Birth datetime NULL,
	Avatar_Img_Url varchar(MAX) NULL,
	Created_Time datetime NULL,
	Updated_Time datetime NULL,
	Is_Deleted smallint NULL,
	Creator_Id int NULL,
	Is_Actived smallint NULL,
	Gender varchar(20) NULL
);

-- 2023/10/06: tunghv create table User_Farm
CREATE TABLE [dbo].[User_Farm](
	Id int NOT NULL IDENTITY(1,1) PRIMARY KEY,
	User_Id int NULL,
	Farm_Id int NULL,
	Is_Deleted smallint NULL
);

-- 2023/10/06: tunghv create table Role
CREATE TABLE [dbo].[Role](
	Role_Id int NOT NULL IDENTITY(1,1) PRIMARY KEY,
	Role_Name varchar(100) NULL,
	Description nvarchar(MAX) NULL,
	Is_Deleted smallint NULL
);

-- 2023/10/06: tunghv create table Function
CREATE TABLE [dbo].[Function](
	Function_Id int NOT NULL IDENTITY(1,1) PRIMARY KEY,
	Function_Name varchar(100) NOT NULL,
	Description nvarchar(MAX) NULL,
	Is_Deleted smallint NULL
);

-- 2023/10/06: tunghv create table Role_Function
CREATE TABLE [dbo].[Role_Function](
	Id int NOT NULL IDENTITY(1,1) PRIMARY KEY,
	Role_Id int NULL,
	Function_Id int NULL,
	Is_Deleted smallint NULL
);

-- 2024/01/29: tunghv create table Maintenance_Report
create table Maintenance_Report (
	Id int not null primary key identity(1,1),
	Farm_Id int NULL,
	House_Id int NULL,
	Rooster_Die int NULL,
	Hen_Die int NULL,
	Rooster_Remove int NULL,
	Hen_Remove int NULL,
	Rooster_Feed_Mass decimal(18,2) NULL,
	Hen_Feed_Mass decimal(18,2) NULL,
	Total_Egg int NULL,
	Select_Egg int NULL,
	Over_Size_Egg int NULL,
	Under_Size_Egg int NULL,
	Deformed_Egg int NULL,
	Dirty_Egg int NULL,
	Beaten_Egg int NULL,
	Broken_Egg int NULL,
	Status nvarchar(200) NULL,
	Feed_Code varchar(50) NULL,
	Medicine_Code varchar(50) NULL,
	Is_Deleted smallint NULL,
	Created_Date datetime NULL,
	Updated_Date datetime NULL,
	Reviewed_Date datetime NULL
);