/** @format */

import React from "react";
import {
  Bed,
  DoorOpen,
  Box,
  Table,
  Tv,
  BookOpen,
  ChefHat,
  Monitor,
  TreePine,
  Package,
  Lamp,
  Image as ImageIcon,
  Wrench,
  CircleDot,
  Square,
  RectangleHorizontal,
  User,
  Eye,
} from "lucide-react";

// Icon component for furniture items using Lucide React icons
export const getFurnitureIcon = (
  itemId: string,
  itemName: string,
  size: number = 14,
  className: string = "text-orange-500"
) => {
  const iconStyle = { width: `${size}px`, height: `${size}px` };
  const iconClass = `flex-shrink-0 ${className}`;

  // Bed-related items
  if (itemId.includes("bed") || itemId.includes("mattress")) {
    return <Bed className={iconClass} style={iconStyle} strokeWidth={1.5} />;
  }

  // Wardrobe items
  if (itemId.includes("wardrobe") || itemId.includes("closet")) {
    return <DoorOpen className={iconClass} style={iconStyle} strokeWidth={1.5} />;
  }

  // Drawers/chest of drawers
  if (itemId.includes("drawer") || itemId.includes("chest")) {
    return <Box className={iconClass} style={iconStyle} strokeWidth={1.5} />;
  }

  // Sofa
  if (itemId.includes("sofa")) {
    return <Box className={iconClass} style={iconStyle} strokeWidth={1.5} />;
  }

  // Armchair
  if (itemId.includes("armchair")) {
    return <User className={iconClass} style={iconStyle} strokeWidth={1.5} />;
  }

  // Chair (dining, office, garden)
  if (itemId.includes("chair")) {
    return <User className={iconClass} style={iconStyle} strokeWidth={1.5} />;
  }

  // Table (dining, coffee, side, kitchen, garden)
  if (itemId.includes("table") || itemId.includes("sideboard") || itemId.includes("desk")) {
    return <Table className={iconClass} style={iconStyle} strokeWidth={1.5} />;
  }

  // Coffee Table
  if (itemId.includes("coffee")) {
    return <Table className={iconClass} style={iconStyle} strokeWidth={1.5} />;
  }

  // Television/TV
  if (itemId.includes("television") || itemId.includes("tv")) {
    return <Tv className={iconClass} style={iconStyle} strokeWidth={1.5} />;
  }

  // TV Stand
  if (itemId.includes("tv-stand") || itemId.includes("stand")) {
    return <Box className={iconClass} style={iconStyle} strokeWidth={1.5} />;
  }

  // Bookcase/Shelving
  if (itemId.includes("bookcase") || itemId.includes("shelv")) {
    return <BookOpen className={iconClass} style={iconStyle} strokeWidth={1.5} />;
  }

  // Fridge Freezer
  if (itemId.includes("fridge") || itemId.includes("freezer")) {
    return <Box className={iconClass} style={iconStyle} strokeWidth={1.5} />;
  }

  // Washing Machine
  if (itemId.includes("washing")) {
    return <CircleDot className={iconClass} style={iconStyle} strokeWidth={1.5} />;
  }

  // Tumble Dryer
  if (itemId.includes("dryer")) {
    return <CircleDot className={iconClass} style={iconStyle} strokeWidth={1.5} />;
  }

  // Microwave/Cooker/Oven
  if (itemId.includes("microwave")) {
    return <Square className={iconClass} style={iconStyle} strokeWidth={1.5} />;
  }

  if (itemId.includes("cooker") || itemId.includes("oven")) {
    return <ChefHat className={iconClass} style={iconStyle} strokeWidth={1.5} />;
  }

  // Dishwasher
  if (itemId.includes("dishwasher")) {
    return <Box className={iconClass} style={iconStyle} strokeWidth={1.5} />;
  }

  // Mirror
  if (itemId.includes("mirror")) {
    return <Eye className={iconClass} style={iconStyle} strokeWidth={1.5} />;
  }

  // Cabinet/Bathroom Cabinet
  if (itemId.includes("cabinet") || itemId.includes("bathroom")) {
    return <Box className={iconClass} style={iconStyle} strokeWidth={1.5} />;
  }

  // Bathtub
  if (itemId.includes("bath") || itemId.includes("tub")) {
    return <Box className={iconClass} style={iconStyle} strokeWidth={1.5} />;
  }

  // Garden/Outdoor items
  if (itemId.includes("garden") || itemId.includes("lawn") || itemId.includes("mower")) {
    return <TreePine className={iconClass} style={iconStyle} strokeWidth={1.5} />;
  }

  if (itemId.includes("bench") || itemId.includes("parasol")) {
    return <User className={iconClass} style={iconStyle} strokeWidth={1.5} />;
  }

  if (itemId.includes("bicycle")) {
    return <CircleDot className={iconClass} style={iconStyle} strokeWidth={1.5} />;
  }

  // Boxes/Packaging
  if (itemId.includes("box") || itemId.includes("suitcase") || itemId.includes("bag")) {
    return <Package className={iconClass} style={iconStyle} strokeWidth={1.5} />;
  }

  // Rug/Carpet
  if (itemId.includes("rug")) {
    return <RectangleHorizontal className={iconClass} style={iconStyle} strokeWidth={1.5} />;
  }

  // Lamp/Lighting
  if (itemId.includes("lamp") || itemId.includes("light")) {
    return <Lamp className={iconClass} style={iconStyle} strokeWidth={1.5} />;
  }

  // Artwork/Picture
  if (itemId.includes("artwork") || itemId.includes("picture")) {
    return <ImageIcon className={iconClass} style={iconStyle} strokeWidth={1.5} />;
  }

  // Tool/Equipment
  if (itemId.includes("tool") || itemId.includes("toolbox") || itemId.includes("workbench") || itemId.includes("ladder")) {
    return <Wrench className={iconClass} style={iconStyle} strokeWidth={1.5} />;
  }

  // Monitor/Computer
  if (itemId.includes("monitor") || itemId.includes("computer")) {
    return <Monitor className={iconClass} style={iconStyle} strokeWidth={1.5} />;
  }

  // Bin/Trash
  if (itemId.includes("bin")) {
    return <CircleDot className={iconClass} style={iconStyle} strokeWidth={1.5} />;
  }

  // Ironing Board
  if (itemId.includes("ironing")) {
    return <RectangleHorizontal className={iconClass} style={iconStyle} strokeWidth={1.5} />;
  }

  // Motorcycle
  if (itemId.includes("motorcycle")) {
    return <CircleDot className={iconClass} style={iconStyle} strokeWidth={1.5} />;
  }

  // Car Tyre
  if (itemId.includes("tyre") || itemId.includes("tire")) {
    return <CircleDot className={iconClass} style={iconStyle} strokeWidth={1.5} />;
  }

  // Side Table/Bedside Table
  if (itemId.includes("side-table") || itemId.includes("bedside")) {
    return <Table className={iconClass} style={iconStyle} strokeWidth={1.5} />;
  }

  // Display Cabinet
  if (itemId.includes("display")) {
    return <Box className={iconClass} style={iconStyle} strokeWidth={1.5} />;
  }

  // Dressing Table
  if (itemId.includes("dressing")) {
    return <Table className={iconClass} style={iconStyle} strokeWidth={1.5} />;
  }

  // Default circle icon for items without specific icons
  return <CircleDot className={iconClass} style={iconStyle} strokeWidth={1.5} />;
};
