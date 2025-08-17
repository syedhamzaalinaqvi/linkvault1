import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertWhatsappGroupSchema } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { X, Link as LinkIcon } from "lucide-react";
import { z } from "zod";

const formSchema = insertWhatsappGroupSchema.extend({
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions"
  })
});

type FormData = z.infer<typeof formSchema>;

interface GroupSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  { value: "education", label: "📚 Education" },
  { value: "business", label: "💼 Business & Entrepreneurship" },
  { value: "technology", label: "💻 Technology & Programming" },
  { value: "sports", label: "⚽ Sports & Fitness" },
  { value: "entertainment", label: "🎭 Entertainment & Movies" },
  { value: "lifestyle", label: "🌟 Lifestyle & Fashion" },
  { value: "news", label: "📰 News & Politics" },
  { value: "gaming", label: "🎮 Gaming" },
  { value: "health", label: "🏥 Health & Medical" },
  { value: "travel", label: "✈️ Travel & Tourism" },
  { value: "food", label: "🍜 Food & Recipes" },
  { value: "music", label: "🎵 Music & Arts" }
];

const countries = [
  { value: "US", label: "🇺🇸 United States" },
  { value: "IN", label: "🇮🇳 India" },
  { value: "UK", label: "🇬🇧 United Kingdom" },
  { value: "CA", label: "🇨🇦 Canada" },
  { value: "AU", label: "🇦🇺 Australia" },
  { value: "DE", label: "🇩🇪 Germany" },
  { value: "FR", label: "🇫🇷 France" },
  { value: "BR", label: "🇧🇷 Brazil" },
  { value: "JP", label: "🇯🇵 Japan" },
  { value: "KR", label: "🇰🇷 South Korea" },
  { value: "MX", label: "🇲🇽 Mexico" },
  { value: "IT", label: "🇮🇹 Italy" },
  { value: "ES", label: "🇪🇸 Spain" },
  { value: "NL", label: "🇳🇱 Netherlands" },
  { value: "SG", label: "🇸🇬 Singapore" },
  { value: "AE", label: "🇦🇪 UAE" }
];

export function GroupSubmissionModal({ isOpen, onClose }: GroupSubmissionModalProps) {
  const [extractedMetadata, setExtractedMetadata] = useState<{ title: string; imageUrl: string } | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      whatsappLink: "",
      category: "",
      country: "",
      imageUrl: "",
      agreeToTerms: false
    }
  });

  const createGroupMutation = useMutation({
    mutationFn: (data: Omit<FormData, 'agreeToTerms'>) => 
      apiRequest("POST", "/api/groups", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/groups'] });
      toast({
        title: "Success!",
        description: "Your WhatsApp group has been submitted successfully."
      });
      form.reset();
      setExtractedMetadata(null);
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit group. Please try again.",
        variant: "destructive"
      });
    }
  });

  const extractMetadataMutation = useMutation({
    mutationFn: (url: string) => 
      apiRequest("POST", "/api/extract-metadata", { url }),
    onSuccess: async (response) => {
      const metadata = await response.json();
      setExtractedMetadata(metadata);
      form.setValue("title", metadata.title);
      form.setValue("imageUrl", metadata.imageUrl);
    },
    onError: () => {
      toast({
        title: "Warning",
        description: "Could not extract metadata. Please enter the group details manually.",
        variant: "destructive"
      });
    }
  });

  const handleLinkChange = (value: string) => {
    form.setValue("whatsappLink", value);
    if (value.includes('chat.whatsapp.com')) {
      extractMetadataMutation.mutate(value);
    } else {
      setExtractedMetadata(null);
    }
  };

  const onSubmit = (data: FormData) => {
    const { agreeToTerms, ...groupData } = data;
    createGroupMutation.mutate(groupData);
  };

  const description = form.watch("description") || "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby="dialog-description">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Submit Your WhatsApp Group
              </DialogTitle>
              <DialogDescription id="dialog-description" className="text-gray-600">
                Share your community with thousands of users worldwide
              </DialogDescription>
            </div>
            <Button variant="ghost" onClick={onClose} className="p-2">
              <X className="w-6 h-6" />
            </Button>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* WhatsApp Group Link */}
            <FormField
              control={form.control}
              name="whatsappLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-900">
                    WhatsApp Group Link *
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type="url"
                        placeholder="https://chat.whatsapp.com/..."
                        onChange={(e) => {
                          field.onChange(e);
                          handleLinkChange(e.target.value);
                        }}
                        className="pr-12"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <LinkIcon className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </FormControl>
                  <p className="text-xs text-gray-500">We'll automatically extract the group name and image</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Auto-extracted Group Info Preview */}
            {extractedMetadata && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Group Preview</h4>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={extractedMetadata.imageUrl} 
                      alt="Group" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">{extractedMetadata.title}</h5>
                    <p className="text-sm text-gray-500">Auto-extracted from WhatsApp link</p>
                  </div>
                </div>
              </div>
            )}

            {/* Manual Title Override */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-900">
                    Group Title *
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter group title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category Selection */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-900">
                    Category *
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Country Selection */}
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-900">
                    Country *
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Group Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-900">
                    Group Description *
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      placeholder="Describe your group's purpose, rules, and what members can expect..."
                      className="resize-none"
                      maxLength={500}
                    />
                  </FormControl>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Be descriptive to attract the right members</span>
                    <span>{description.length}/500</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Terms and Submit */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <FormField
                control={form.control}
                name="agreeToTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <Label className="text-sm text-gray-600">
                        I confirm that I am an admin of this WhatsApp group and have the right to submit it. I agree to the{" "}
                        <a href="#" className="text-whatsapp-600 hover:underline">Terms of Service</a> and{" "}
                        <a href="#" className="text-whatsapp-600 hover:underline">Community Guidelines</a>.
                      </Label>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createGroupMutation.isPending}
                  className="flex-1 bg-whatsapp-500 hover:bg-whatsapp-600"
                >
                  {createGroupMutation.isPending ? 'Submitting...' : 'Submit Group'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
