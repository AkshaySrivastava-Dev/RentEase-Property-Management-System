/**
 * RentEase Property Service
 * Manages properties CRUD and status statistics.
 */

const propertyService = {
  getStorage() {
    return window.RentEase?.storage || storage;
  },

  getKeys() {
    return window.RentEase?.CONSTANTS?.STORAGE_KEYS || STORAGE_KEYS;
  },

  getAll(filters = {}) {
    let properties = this.getStorage().getAll(this.getKeys().PROPERTIES);

    // Normalize status to standard 'Available', 'Occupied', 'Maintenance'
    properties = properties.map((p) => {
      let st = p.status || 'Available';
      const sLower = String(st).toLowerCase();
      if (sLower === 'vacant' || sLower === 'available') st = 'Available';
      else if (sLower === 'occupied') st = 'Occupied';
      else if (sLower === 'maintenance') st = 'Maintenance';
      return { ...p, status: st };
    });

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      properties = properties.filter(
        (p) =>
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.address && p.address.toLowerCase().includes(q)) ||
          (p.city && p.city.toLowerCase().includes(q))
      );
    }

    if (filters.status && filters.status !== 'All') {
      const filterLower = String(filters.status).toLowerCase();
      properties = properties.filter((p) => {
        const pLower = String(p.status).toLowerCase();
        if (filterLower === 'available' || filterLower === 'vacant') {
          return pLower === 'available' || pLower === 'vacant';
        }
        return pLower === filterLower;
      });
    }

    if (filters.type && filters.type !== 'All') {
      properties = properties.filter((p) => String(p.type).toLowerCase() === String(filters.type).toLowerCase());
    }

    return properties;
  },

  getById(id) {
    if (!id) return null;
    return this.getStorage().getById(this.getKeys().PROPERTIES, id);
  },

  createProperty(data) {
    const {
      title,
      address,
      city,
      type = 'Apartment',
      rent,
      bedrooms = 1,
      bathrooms = 1,
      amenities = [],
      status = 'Available',
      image
    } = data;

    if (!title || !title.trim()) {
      return { success: false, error: 'Property title is required.' };
    }
    if (!address || !address.trim()) {
      return { success: false, error: 'Street address is required.' };
    }
    if (!city || !city.trim()) {
      return { success: false, error: 'City is required.' };
    }
    if (!window.RentEase.validators.isPositiveNumber(rent)) {
      return { success: false, error: 'Monthly rent must be a positive number.' };
    }

    const defaultImages = [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    ];
    const pickedImage = image && image.trim() ? image.trim() : defaultImages[Math.floor(Math.random() * defaultImages.length)];

    const newProperty = {
      id: window.RentEase.helpers.generateId('prop'),
      title: title.trim(),
      address: address.trim(),
      city: city.trim(),
      type,
      rent: Number(rent),
      bedrooms: Number(bedrooms) || 1,
      bathrooms: Number(bathrooms) || 1,
      amenities: Array.isArray(amenities) ? amenities : [],
      status: status || 'Available',
      image: pickedImage,
      createdAt: new Date().toISOString()
    };

    this.getStorage().insert(this.getKeys().PROPERTIES, newProperty);
    return { success: true, property: newProperty };
  },

  updateProperty(id, data) {
    const existing = this.getById(id);
    if (!existing) {
      return { success: false, error: 'Property not found.' };
    }

    if (data.title !== undefined && !data.title.trim()) {
      return { success: false, error: 'Property title cannot be empty.' };
    }
    if (data.rent !== undefined && !window.RentEase.validators.isPositiveNumber(data.rent)) {
      return { success: false, error: 'Rent must be a positive number.' };
    }

    const updates = { ...data };
    if (updates.title) updates.title = updates.title.trim();
    if (updates.address) updates.address = updates.address.trim();
    if (updates.city) updates.city = updates.city.trim();
    if (updates.rent !== undefined) updates.rent = Number(updates.rent);
    if (updates.bedrooms !== undefined) updates.bedrooms = Number(updates.bedrooms);
    if (updates.bathrooms !== undefined) updates.bathrooms = Number(updates.bathrooms);

    const updated = this.getStorage().update(this.getKeys().PROPERTIES, id, updates);
    return { success: true, property: updated };
  },

  deleteProperty(id) {
    const existing = this.getById(id);
    if (!existing) {
      return { success: false, error: 'Property not found.' };
    }

    // Check if an active lease exists
    const leases = this.getStorage().getAll(this.getKeys().LEASES);
    const activeLease = leases.find((l) => l.propertyId === id && l.status === 'Active');
    if (activeLease) {
      return {
        success: false,
        error: 'Cannot delete property with an active lease. Please terminate or reassign the lease first.'
      };
    }

    this.getStorage().delete(this.getKeys().PROPERTIES, id);
    return { success: true };
  },

  getStats() {
    const properties = this.getAll();
    const total = properties.length;
    const occupied = properties.filter((p) => p.status === 'Occupied').length;
    const available = properties.filter((p) => p.status === 'Available').length;
    const maintenance = properties.filter((p) => p.status === 'Maintenance').length;

    return { total, occupied, available, maintenance };
  }
};

propertyService.create = function(data) {
  const res = this.createProperty(data);
  return res.success ? res.property : null;
};
propertyService.getAllProperties = function(filters) {
  return this.getAll(filters);
};
propertyService.getPropertyById = function(id) {
  return this.getById(id);
};
propertyService.update = function(id, data) {
  const res = this.updateProperty(id, data);
  return res.success ? res.property : null;
};
propertyService.delete = function(id) {
  const res = this.deleteProperty(id);
  return res.success;
};

const PropertyService = propertyService;

if (typeof window !== 'undefined') {
  window.RentEase = window.RentEase || {};
  window.RentEase.propertyService = propertyService;
  window.PropertyService = propertyService;
  window.propertyService = propertyService;
}

if (typeof global !== 'undefined') {
  global.PropertyService = propertyService;
  global.propertyService = propertyService;
  if (typeof window !== 'undefined') {
    window.RentEase = window.RentEase || {};
    window.RentEase.propertyService = propertyService;
  }
}
