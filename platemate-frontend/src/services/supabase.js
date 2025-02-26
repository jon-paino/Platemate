import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_KEY
);

/**
 * Creates a new Supabase account for a user.
 * 
 * @async
 * @function
 * @param {string} name - The name of the user.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<string>} - Returns 'Success' or an error message if account creation fails.
 */
export async function createSupabaseAccount(name, email, password) {
    console.log("Creating account with name:", name, "email:", email, "password:", password);
    const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                name: name,
            }
        }
    });

    return error?.message ?? 'Success';
}

/**
 * Logs in a user using Supabase authentication.
 * 
 * @async
 * @function
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<string>} - Returns 'Success' or an error message if login fails.
 */
export async function loginSupabaseAccount(email, password) {
    const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    return error?.message ?? 'Success';
}

/**
 * Logs out the current user.
 * 
 * @async
 * @function
 * @returns {Promise<void>}
 */
export async function logoutSupabaseAccount() {
    await supabase.auth.signOut();
}

/**
 * Retrieves the current user's session.
 * 
 * @async
 * @function
 * @returns {Promise<Object|null>} - The user's session or null if not logged in.
 */
export async function getUserSession() {
    try {
        const { data: session, error } = await supabase.auth.getSession();
        return session;
    }
    catch (error) {
        console.error('Error getting user session:', error);
        return null;
    }
}

/**
 * Saves equipment and workout data to Supabase.
 * 
 * @async
 * @function
 * @param {Array<Object>} equipmentDetails - Array of equipment details to save.
 * @param {Array<Object>} workouts - Array of workout details to save.
 * @throws Will throw an error if saving data fails.
 * @returns {Promise<void>}
 */
export async function saveToSupabase(equipmentDetails, workouts) {
    try {
        const session = await getUserSession();

        if (!session) {
            console.error('User session not found.');
            return;
        }

        const userId = session.session.user.id;
        console.log("User ID:", userId);
        
        const current_equipment = await fetchEquipment();
        const current_workouts = await fetchWorkouts();

        // Filter out existing equipment and workouts
        const existingEquipmentNames = new Set(current_equipment.map(item => item.equipment_name));
        const newEquipment = equipmentDetails.filter(item => !existingEquipmentNames.has(item.equipment_name));

        const existingWorkoutNames = new Set(current_workouts.map(item => item.workout_name));
        const newWorkouts = workouts.filter(item => !existingWorkoutNames.has(item.workout_name));

        // Insert new equipment
        if (newEquipment.length > 0) {
            const equipmentInsert = newEquipment.map(item => ({
                user_id: userId,
                equipment_name: item.equipment_name,
                equipment_description: item.equipment_description,
            }));

            const { error: equipmentError } = await supabase
                .from("equipment")
                .insert(equipmentInsert);

            if (equipmentError && !equipmentError.message.includes("duplicate key")) {
                throw new Error(`Error inserting equipment: ${equipmentError.message}`);
            }
        }

        // Insert new workouts
        if (newWorkouts.length > 0) {
            const workoutInsert = newWorkouts.map(item => ({
                user_id: userId,
                workout_name: item.workout_name,
                muscles_targeted: item.muscles_targeted,
                equipment_required: item.equipment_required,
                workout_description: item.workout_description,
            }));

            const { error: workoutError } = await supabase
                .from("workouts")
                .insert(workoutInsert);

            if (workoutError && !workoutError.message.includes("duplicate key")) {
                throw new Error(`Error inserting workouts: ${workoutError.message}`);
            }
        }

        console.log("Data saved successfully to Supabase!");

    } catch (error) {
        console.error("Error saving data to Supabase:", error);
        throw error;
    }
};

/**
 * Fetches all equipment for the logged-in user.
 * 
 * @async
 * @function
 * @returns {Promise<Array<Object>|null>} - An array of equipment or null if an error occurs.
 */
export async function fetchEquipment() {
    try {
        const session = await getUserSession();

        if (!session) {
            console.error('User session not found.');
            return;
        }

        const userId = session.session.user.id;

        const { data: equipment, error: equipmentError } = await supabase
            .from("equipment")
            .select("*")
            .eq("user_id", userId);

        if (equipmentError) {
            throw new Error(`Error fetching equipment: ${equipmentError.message}`);
        }

        return equipment;
    }
    catch (error) {
        console.error('Error fetching equipment:', error);
        return null;
    }
}

/**
 * Fetches all workouts for the logged-in user.
 * 
 * @async
 * @function
 * @returns {Promise<Array<Object>|null>} - An array of workouts or null if an error occurs.
 */
export async function fetchWorkouts() {
    try {
        const session = await getUserSession();

        if (!session) {
            console.error('User session not found.');
            return;
        }

        const userId = session.session.user.id;

        const { data: workouts, error: workoutsError } = await supabase
            .from("workouts")
            .select("*")
            .eq("user_id", userId);

        if (workoutsError) {
            throw new Error(`Error fetching workouts: ${workoutsError.message}`);
        }

        return workouts;
    }
    catch (error) {
        console.error('Error fetching workouts:', error);
        return null;
    }
}

/**
 * Deletes a specific equipment item by ID.
 * 
 * @async
 * @function
 * @param {number} equipmentId - The ID of the equipment to delete.
 * @throws Will throw an error if deletion fails.
 * @returns {Promise<void>}
 */
export async function deleteEquipment(equipmentId) {
    try {
        const session = await getUserSession();

        if (!session) {
            console.error('User session not found.');
            return;
        }

        const userId = session.session.user.id;

        const { data: equipment, error: fetchError } = await supabase
            .from("equipment")
            .select("id")
            .eq("id", equipmentId)
            .eq("user_id", userId)
            .single();

        if (fetchError || !equipment) {
            throw new Error("Equipment not found or does not belong to the user.");
        }

        const { error: deleteError } = await supabase
            .from("equipment")
            .delete()
            .eq("id", equipmentId);

        if (deleteError) {
            throw new Error(`Error deleting equipment: ${deleteError.message}`);
        }

        console.log("Equipment deleted successfully.");
    } catch (error) {
        console.error("Error deleting equipment:", error);
        throw error;
    }
}

/**
 * Deletes a specific workout by ID.
 * 
 * @async
 * @function
 * @param {number} workoutId - The ID of the workout to delete.
 * @throws Will throw an error if deletion fails.
 * @returns {Promise<void>}
 */
export async function deleteWorkout(workoutId) {
    try {
        const session = await getUserSession();

        if (!session) {
            console.error('User session not found.');
            return;
        }

        const userId = session.session.user.id;

        const { data: workout, error: fetchError } = await supabase
            .from("workouts")
            .select("id")
            .eq("id", workoutId)
            .eq("user_id", userId)
            .single();

        if (fetchError || !workout) {
            throw new Error("Workout not found or does not belong to the user.");
        }

        const { error: deleteError } = await supabase
            .from("workouts")
            .delete()
            .eq("id", workoutId);

        if (deleteError) {
            throw new Error(`Error deleting workout: ${deleteError.message}`);
        }

        console.log("Workout deleted successfully.");
    } catch (error) {
        console.error("Error deleting workout:", error);
        throw error;
    }
}

/**
 * Fetches equipment recommendations based on user's uploaded equipment.
 * 
 * @async
 * @function
 * @returns {Promise<Array<Object>|null>} - An array of equipment recommendations or null if an error occurs.
 */
export async function fetchEquipmentRecommendations() {
    try {
        const session = await getUserSession();

        if (!session) {
            console.error('User session not found.');
            return;
        }

        const userId = session.session.user.id;

        // Fetch the user's equipment from the database
        const { data: equipment, error: equipmentError } = await supabase
            .from("equipment")
            .select("equipment_name")
            .eq("user_id", userId);

        if (equipmentError) {
            throw new Error(`Error fetching equipment: ${equipmentError.message}`);
        }

        if (!equipment || equipment.length === 0) {
            console.error('No equipment found for user.');
            return;
        }

        // Send the equipment names to the backend for recommendations
        const response = await fetch("http://127.0.0.1:5000/get-equipment-recommendations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ equipment: equipment.map(item => item.equipment_name) }),
        });

        if (!response.ok) {
            throw new Error(`Error fetching recommendations: ${response.statusText}`);
        }

        const data = await response.json();
        // console.log("Data:", data);
        console.log("Recommendations:", data.recommendations);
        return data.recommendations;
    } catch (error) {
        console.error("Error fetching equipment recommendations:", error);
        throw error;
    }
}
