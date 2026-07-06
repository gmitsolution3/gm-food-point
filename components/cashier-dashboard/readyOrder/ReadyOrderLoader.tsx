import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function ReadyOrderLoader() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="flex items-center gap-4">
            <div className="h-8 w-20 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((index) => (
            <Card
              key={index}
              className="bg-green-50/50 border-0 shadow-lg"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse" />
                    <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
                    <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-200 animate-pulse" />
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                      </div>
                      <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between bg-white/50 p-2 rounded-md">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="w-full text-center pt-1">
                  <div className="h-3 w-32 mx-auto bg-gray-200 rounded animate-pulse" />
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <div className="w-full h-10 bg-gray-200 rounded-lg animate-pulse" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
