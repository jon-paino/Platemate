import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_KEY
);

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

export async function loginSupabaseAccount(email, password) {
    const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    return error?.message ?? 'Success';
}

export async function logoutSupabaseAccount() {
    await supabase.auth.signOut();
}

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

export async function saveToSupabase (equipmentDetails, workouts) {
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

         // Filter out equipment that already exists
         const existingEquipmentNames = new Set(current_equipment.map(item => item.equipment_name));
         const newEquipment = equipmentDetails.filter(item => !existingEquipmentNames.has(item.equipment_name));
 
         // Filter out workouts that already exist
         const existingWorkoutNames = new Set(current_workouts.map(item => item.workout_name));
         const newWorkouts = workouts.filter(item => !existingWorkoutNames.has(item.workout_name));

        // Insert equipment details into Supabase
        if (newEquipment.length > 0) {
            const equipmentInsert = newEquipment.map((item) => ({
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

        // Insert workouts into Supabase
        if (newWorkouts.length > 0) {
            const workoutInsert = newWorkouts.map((item) => ({
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
