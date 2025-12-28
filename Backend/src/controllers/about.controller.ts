import { Request, Response, NextFunction } from 'express';
import About, { IAbout } from '../models/about.model';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import logger from '../utils/logger';

// @desc    Get about content
// @route   GET /api/about
// @access  Public
export const getAbout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    let about = await About.findOne();

    // If no about document exists, create default one
    if (!about) {
      about = await About.create({
        heroTitle: 'About RASS Engineering',
        heroSubtitle: "Building Nepal's infrastructure with precision",
        mission: 'To deliver world-class engineering and construction solutions that exceed client expectations while maintaining the highest standards of safety, quality, and environmental responsibility.',
        vision: "To be recognized as Nepal's leading engineering and construction company, known for innovation, reliability, and sustainable practices.",
        history: 'Founded in 2050 B.S., RASS Engineering & Construction Pvt. Ltd. has been a pioneer in specialized construction solutions across Nepal.',
        values: [],
        team: [],
        stats: []
      });
    }

    res.status(200).json({
      success: true,
      data: about
    });
  } catch (error: any) {
    logger.error(`Get about error: ${error.message}`);
    return next(new AppError('Failed to fetch about content', 500));
  }
});

// @desc    Update about content (Admin)
// @route   PUT /api/about
// @access  Private
export const updateAbout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    let about = await About.findOne();

    if (!about) {
      // Create if doesn't exist
      about = await About.create(req.body);
    } else {
      // Update existing
      Object.assign(about, req.body);
      await about.save();
    }

    logger.info(`About content updated by admin: ${req.user?.email || 'unknown'}`);

    res.status(200).json({
      success: true,
      message: 'About content updated successfully',
      data: about
    });
  } catch (error: any) {
    logger.error(`Update about error: ${error.message}`);
    return next(new AppError(error.message || 'Failed to update about content', 500));
  }
});

// @desc    Update main content (hero, mission, vision)
// @route   PATCH /api/about/main
// @access  Private
export const updateMainContent = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { heroTitle, heroSubtitle, mission, vision } = req.body;

  try {
    let about = await About.findOne();

    if (!about) {
      about = await About.create({
        heroTitle,
        heroSubtitle,
        mission,
        vision,
        history: '',
        values: [],
        team: [],
        stats: []
      });
    } else {
      about.heroTitle = heroTitle || about.heroTitle;
      about.heroSubtitle = heroSubtitle || about.heroSubtitle;
      about.mission = mission || about.mission;
      about.vision = vision || about.vision;
      await about.save();
    }

    logger.info(`Main content updated by admin: ${req.user?.email || 'unknown'}`);

    res.status(200).json({
      success: true,
      message: 'Main content updated successfully',
      data: about
    });
  } catch (error: any) {
    logger.error(`Update main content error: ${error.message}`);
    return next(new AppError('Failed to update main content', 500));
  }
});

// @desc    Update story section
// @route   PATCH /api/about/story
// @access  Private
export const updateStory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { history, storyTitle, storyImage } = req.body;

  try {
    let about = await About.findOne();

    if (!about) {
      return next(new AppError('About content not found', 404));
    }

    about.history = history || about.history;
    about.storyTitle = storyTitle || about.storyTitle;
    about.storyImage = storyImage || about.storyImage;
    await about.save();

    logger.info(`Story section updated by admin: ${req.user?.email || 'unknown'}`);

    res.status(200).json({
      success: true,
      message: 'Story section updated successfully',
      data: about
    });
  } catch (error: any) {
    logger.error(`Update story error: ${error.message}`);
    return next(new AppError('Failed to update story section', 500));
  }
});

// @desc    Add/Update team member
// @route   POST /api/about/team
// @access  Private
export const addTeamMember = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id, name, position, email, bio, image } = req.body;

  if (!name || !position) {
    return next(new AppError('Name and position are required', 400));
  }

  try {
    let about = await About.findOne();

    if (!about) {
      return next(new AppError('About content not found', 404));
    }

    const existingIndex = about.team.findIndex(m => m.id === id);

    if (existingIndex !== -1) {
      // Update existing
      about.team[existingIndex] = { id, name, position, email, bio, image };
    } else {
      // Add new
      about.team.push({ id: id || Date.now().toString(), name, position, email, bio, image });
    }

    await about.save();

    logger.info(`Team member added/updated by admin: ${req.user?.email || 'unknown'}`);

    res.status(200).json({
      success: true,
      message: 'Team member saved successfully',
      data: about
    });
  } catch (error: any) {
    logger.error(`Add team member error: ${error.message}`);
    return next(new AppError('Failed to save team member', 500));
  }
});

// @desc    Delete team member
// @route   DELETE /api/about/team/:id
// @access  Private
export const deleteTeamMember = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    let about = await About.findOne();

    if (!about) {
      return next(new AppError('About content not found', 404));
    }

    about.team = about.team.filter(m => m.id !== id);
    await about.save();

    logger.info(`Team member deleted by admin: ${req.user?.email || 'unknown'} - ${id}`);

    res.status(200).json({
      success: true,
      message: 'Team member deleted successfully',
      data: about
    });
  } catch (error: any) {
    logger.error(`Delete team member error: ${error.message}`);
    return next(new AppError('Failed to delete team member', 500));
  }
});

// @desc    Add/Update company value
// @route   POST /api/about/values
// @access  Private
export const addValue = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id, icon, title, description } = req.body;

  if (!title || !description) {
    return next(new AppError('Title and description are required', 400));
  }

  try {
    let about = await About.findOne();

    if (!about) {
      return next(new AppError('About content not found', 404));
    }

    const existingIndex = about.values.findIndex(v => v.id === id);

    if (existingIndex !== -1) {
      // Update existing
      about.values[existingIndex] = { id, icon: icon || 'Award', title, description };
    } else {
      // Add new
      about.values.push({ id: id || Date.now().toString(), icon: icon || 'Award', title, description });
    }

    await about.save();

    logger.info(`Company value added/updated by admin: ${req.user?.email || 'unknown'}`);

    res.status(200).json({
      success: true,
      message: 'Company value saved successfully',
      data: about
    });
  } catch (error: any) {
    logger.error(`Add value error: ${error.message}`);
    return next(new AppError('Failed to save company value', 500));
  }
});

// @desc    Delete company value
// @route   DELETE /api/about/values/:id
// @access  Private
export const deleteValue = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    let about = await About.findOne();

    if (!about) {
      return next(new AppError('About content not found', 404));
    }

    about.values = about.values.filter(v => v.id !== id);
    await about.save();

    logger.info(`Company value deleted by admin: ${req.user?.email || 'unknown'} - ${id}`);

    res.status(200).json({
      success: true,
      message: 'Company value deleted successfully',
      data: about
    });
  } catch (error: any) {
    logger.error(`Delete value error: ${error.message}`);
    return next(new AppError('Failed to delete company value', 500));
  }
});

// @desc    Add/Update stat
// @route   POST /api/about/stats
// @access  Private
export const addStat = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { label, value } = req.body;

  if (!label || !value) {
    return next(new AppError('Label and value are required', 400));
  }

  try {
    let about = await About.findOne();

    if (!about) {
      return next(new AppError('About content not found', 404));
    }

    about.stats.push({ label, value });
    await about.save();

    logger.info(`Stat added by admin: ${req.user?.email || 'unknown'}`);

    res.status(200).json({
      success: true,
      message: 'Stat added successfully',
      data: about
    });
  } catch (error: any) {
    logger.error(`Add stat error: ${error.message}`);
    return next(new AppError('Failed to add stat', 500));
  }
});

// @desc    Delete stat
// @route   DELETE /api/about/stats/:index
// @access  Private
export const deleteStat = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { index } = req.params;

  try {
    let about = await About.findOne();

    if (!about) {
      return next(new AppError('About content not found', 404));
    }

    about.stats.splice(parseInt(index), 1);
    await about.save();

    logger.info(`Stat deleted by admin: ${req.user?.email || 'unknown'} - index ${index}`);

    res.status(200).json({
      success: true,
      message: 'Stat deleted successfully',
      data: about
    });
  } catch (error: any) {
    logger.error(`Delete stat error: ${error.message}`);
    return next(new AppError('Failed to delete stat', 500));
  }
});

// @desc    Update leadership info
// @route   PATCH /api/about/leadership
// @access  Private
export const updateLeadership = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { directorName, directorPosition, directorExperience, directorBio } = req.body;

  try {
    let about = await About.findOne();

    if (!about) {
      return next(new AppError('About content not found', 404));
    }

    about.directorName = directorName || about.directorName;
    about.directorPosition = directorPosition || about.directorPosition;
    about.directorExperience = directorExperience || about.directorExperience;
    about.directorBio = directorBio || about.directorBio;
    await about.save();

    logger.info(`Leadership info updated by admin: ${req.user?.email || 'unknown'}`);

    res.status(200).json({
      success: true,
      message: 'Leadership information updated successfully',
      data: about
    });
  } catch (error: any) {
    logger.error(`Update leadership error: ${error.message}`);
    return next(new AppError('Failed to update leadership information', 500));
  }
});