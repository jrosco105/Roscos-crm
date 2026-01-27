CREATE TABLE `billsOfLading` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobId` int NOT NULL,
	`bolNumber` varchar(50) NOT NULL,
	`items` json NOT NULL,
	`customerSignature` text,
	`crewSignatureIds` json,
	`status` enum('draft','signed','completed') NOT NULL DEFAULT 'draft',
	`damageNotes` text,
	`specialNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`signedAt` timestamp,
	CONSTRAINT `billsOfLading_id` PRIMARY KEY(`id`),
	CONSTRAINT `billsOfLading_bolNumber_unique` UNIQUE(`bolNumber`)
);
--> statement-breakpoint
CREATE TABLE `crew` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320),
	`phone` varchar(20) NOT NULL,
	`status` enum('active','inactive','on_leave') NOT NULL DEFAULT 'active',
	`availableFrom` timestamp,
	`availableTo` timestamp,
	`certifications` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `crew_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobId` int NOT NULL,
	`invoiceNumber` varchar(50) NOT NULL,
	`status` enum('draft','sent','partially_paid','paid','overdue','cancelled') NOT NULL DEFAULT 'draft',
	`subtotal` decimal(10,2) NOT NULL,
	`tax` decimal(10,2) DEFAULT '0',
	`total` decimal(10,2) NOT NULL,
	`depositAmount` decimal(10,2) DEFAULT '0',
	`depositPaid` boolean DEFAULT false,
	`finalAmount` decimal(10,2) DEFAULT '0',
	`finalPaid` boolean DEFAULT false,
	`paymentMethod` enum('paypal','cash','check','credit_card'),
	`paypalTransactionId` varchar(255),
	`issuedAt` timestamp NOT NULL DEFAULT (now()),
	`dueAt` timestamp,
	`paidAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `invoices_id` PRIMARY KEY(`id`),
	CONSTRAINT `invoices_invoiceNumber_unique` UNIQUE(`invoiceNumber`)
);
--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`status` enum('scheduled','in_progress','completed','cancelled') NOT NULL DEFAULT 'scheduled',
	`customerName` varchar(255) NOT NULL,
	`customerEmail` varchar(320),
	`customerPhone` varchar(20) NOT NULL,
	`moveDate` timestamp NOT NULL,
	`originZip` varchar(10) NOT NULL,
	`destinationZip` varchar(10) NOT NULL,
	`estimatedDistance` decimal(10,2),
	`inventory` json,
	`quotedPrice` decimal(10,2) NOT NULL,
	`finalPrice` decimal(10,2),
	`crewIds` json,
	`vehicleIds` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`completedAt` timestamp,
	CONSTRAINT `jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`status` enum('new','quoted','booked','completed','cancelled') NOT NULL DEFAULT 'new',
	`customerName` varchar(255) NOT NULL,
	`customerEmail` varchar(320),
	`customerPhone` varchar(20) NOT NULL,
	`moveDate` timestamp,
	`originZip` varchar(10) NOT NULL,
	`destinationZip` varchar(10) NOT NULL,
	`homeSize` enum('studio','1bed','2bed','3bed','4bed','5bed_plus','commercial') NOT NULL,
	`inventory` json,
	`estimatedDistance` decimal(10,2),
	`estimatedCost` decimal(10,2),
	`quoteNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`quotedAt` timestamp,
	`bookedAt` timestamp,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recipientId` int,
	`recipientEmail` varchar(320),
	`recipientPhone` varchar(20),
	`type` enum('email','sms','in_app') NOT NULL,
	`subject` varchar(255),
	`content` text NOT NULL,
	`relatedJobId` int,
	`relatedLeadId` int,
	`status` enum('pending','sent','failed') NOT NULL DEFAULT 'pending',
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`sentAt` timestamp,
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pricingRules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`baseCostPerMove` decimal(10,2) NOT NULL,
	`costPerMile` decimal(10,2) NOT NULL,
	`costPerLaborHour` decimal(10,2) NOT NULL,
	`minimumCharge` decimal(10,2),
	`weekendSurcharge` decimal(5,2),
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pricingRules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`estimatedDistance` decimal(10,2) NOT NULL,
	`estimatedCost` decimal(10,2) NOT NULL,
	`baseCost` decimal(10,2) NOT NULL,
	`distanceCost` decimal(10,2) NOT NULL,
	`laborCost` decimal(10,2) NOT NULL,
	`notes` text,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quotes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vehicles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`licensePlate` varchar(20) NOT NULL,
	`type` enum('box_truck','moving_van','pickup','cargo_van') NOT NULL,
	`capacity` varchar(100),
	`status` enum('active','maintenance','retired') NOT NULL DEFAULT 'active',
	`availableFrom` timestamp,
	`availableTo` timestamp,
	`lastServiceDate` timestamp,
	`nextServiceDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vehicles_id` PRIMARY KEY(`id`),
	CONSTRAINT `vehicles_licensePlate_unique` UNIQUE(`licensePlate`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','crew') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);