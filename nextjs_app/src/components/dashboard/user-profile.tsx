"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Mail, Edit, Save, X, Camera, Calendar, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {useGetStore} from "@/helpers/store";
import {handleError, patchRequest, postRequest} from "@/helpers/ui/handlers";
import useSWRMutation from "swr/mutation";
import {ConstantsForMainUser} from "@/helpers/string_const";
import {showLoadingBar} from "@/helpers/ui/uiHelpers";

const editUserFetcher = async (url: string, {arg}: { arg: { userName: string;} }) => {
  return await patchRequest(url, {
    [ConstantsForMainUser.USER_NAME] : arg.userName,
  });
}

export function UserProfile() {
  const {
    userName:name,
      email,
  } = useGetStore();

  const [userData, setUserData] = useState({
    name,
    email,
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState(userData);

  const {
    trigger, isMutating, error
  } = useSWRMutation('/api/user/update-profile',editUserFetcher);

  const handleSave = async  () => {
    try {
      const responseData = await trigger({
        userName: editedData.name,
      });

      setUserData(editedData);
      setIsEditing(false);


    }catch (error) {
      handleError(error);
    }
  }


  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setEditedData(userData)
    }
    setIsEditing(!isEditing)
  }


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  if (error) handleError(error);

  if (isMutating) return showLoadingBar();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {/* Profile Header */}
        <div className="relative h-48 bg-gradient-to-r from-primary/80 to-primary/40">
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-4 bg-background/80 backdrop-blur-sm hover:bg-background"
          >
            <Camera className="h-4 w-4" />
            <span className="sr-only">Change cover photo</span>
          </Button>
        </div>

        {/* Profile Info Section */}
        <div className="px-6 sm:px-8 pb-8 -mt-16 relative">
          {/* Avatar */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-card bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-500 dark:text-blue-300">
                <span className="text-4xl font-bold">{userData.name.charAt(0)}</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-background shadow-md hover:bg-accent"
              >
                <Camera className="h-4 w-4" />
                <span className="sr-only">Change profile photo</span>
              </Button>
            </div>

            <div className="mt-4 sm:mt-0 sm:ml-6 flex flex-col sm:flex-row items-center sm:items-end sm:justify-between w-full">
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold">{userData.name}</h2>
                <p className="text-muted-foreground">{userData.email}</p>
              </div>

              <div className="mt-4 sm:mt-0">
                <Button
                  onClick={handleEditToggle}
                  variant={isEditing ? "outline" : "default"}
                  className="flex items-center gap-2"
                >
                  {isEditing ? (
                    <>
                      <X className="h-4 w-4" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Profile Content */}
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="edit-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="min-h-[200px]" // Minimum height to maintain consistency
              >
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" value={editedData.name} onChange={handleChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={editedData.email} 
                      readOnly 
                      className="cursor-not-allowed opacity-70" 
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <Button onClick={handleSave} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="profile-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="min-h-[200px]" // Minimum height to maintain consistency
              >
                <div className="space-y-6 max-w-md">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Personal Information</h3>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Full Name</p>
                          <p className="font-medium">{userData.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{userData.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

